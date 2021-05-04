import React, {useRef, useState, useEffect, useCallback} from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import {showSuccess, showError} from '../../actions/Error'
import BusyMask from '../BusyMask'
import Loading from '../Loading'
import { get, filter, map, includes, head } from 'lodash'
import { TextField } from '@material-ui/core'
import { loadGoogleApi } from './GoogleLoader'

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
    },
    search_box: {
        width: '100%',
        height: "40px",
    }
}))

const GlobalCss = withStyles({
    "@global": {
        // Required to make the google auto complete popup show over the slide-in side-bar
        ".pac-container": { zIndex: 9999 }
    },
})(() => null)

export const AddressAutoComplete = ({formatted_address, onChanged}) => {
    const classes = useStyles()
    const [query, setQuery] = useState(formatted_address)
    const autoCompleteRef = useRef(null)
    const { isLoaded, loadError } = loadGoogleApi()
    
    const renderAutoComplete = useCallback(() => {
        const autoComplete = new window.google.maps.places.Autocomplete(
            autoCompleteRef.current,
            {componentRestrictions: {country: 'za'}}
        )
        const geocoder = new window.google.maps.Geocoder()
        
        autoComplete.setFields(["address_components", "formatted_address", "geometry"])
        autoComplete.addListener("place_changed", () => {
            const addressObject = autoComplete.getPlace()
            const query = addressObject.formatted_address
            const place = autoComplete.getPlace()
            const res = {formatted_address: place.formatted_address,
                         latitude: place.geometry.location.lat(),
                         longitude: place.geometry.location.lng()}
            
            const getForType = (t) => {
                return get(head(filter(place.address_components, (c) => includes(c.types, t))), "long_name", "")
            }
            res.street1 = getForType("street_number") + " " + getForType("route")
            res.street2 = getForType("sublocality_level_2")
            res.city_name = getForType("locality")
            res.province_name = getForType("administrative_area_level_1")
            res.country_name = getForType("country")
            res.postal_code = getForType("postal_code")
            
            onChanged(res)
        })
    }, [])

    if (loadError) {
        return <div>Couldn't load Google maps, check the API key</div>
    }

    const onChange = (evt) => {
        setQuery(evt.target.value)
    }
    
    return (
        <div className={classes.container}>
          <GlobalCss />
          <input ref={autoCompleteRef}
                 className={classes.search_box}
                 variant="outlined"
                 placeholder="Auto-populate using Google Map search"
                 margin="normal"
                 initialvalue={query}
                 onChange={onChange}
          />
          { isLoaded ? renderAutoComplete() : <BusyMask /> }
        </div>
    )
}

