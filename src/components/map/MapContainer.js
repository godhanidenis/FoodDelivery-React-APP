import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import RoomIcon from '@material-ui/icons/Room'
import { loadGoogleApi } from './GoogleLoader'
import Loading from '../Loading'

const containerStyle = {
    width: 'auto',
    height: '310px'
}
const divStyle = {
    background: `white`,
    padding: 5
}

const MapContainer = (props)  => {
    const [ selected, setSelected ] = useState({})

    const onSelect = item => {
        setSelected(item)
    }
    let currentPosition = {}
    let numItems = 0
    
    if(props.locations.some(item => item.location) > 1) {
        const [ currentPosition, setCurrentPosition ] = useState({})
        const success = position => {
            currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            setCurrentPosition(currentPosition)
        }

        useEffect(() => {
            navigator.geolocation.getCurrentPosition(success)
        })
    } else {
        currentPosition = {
            lat: props.locations[0]['location']['lat'],
            lng: props.locations[0]['location']['lng'],
        }
        numItems = 1
    }

    const { isLoaded, loadError } = loadGoogleApi()

    
    if (loadError) {
        return <div>Couldn't load Google maps, check the API key</div>
    }

    return (
        // Got some script loading problems to resolve, not priority right now.
        <div>
          Map coming soon, watch this space.
        </div>
    )
    
    return (
        <>
          { ! isLoaded && <Loading msg={"Loading Google map libraries"} /> }
          { isLoaded && 
            
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentPosition}
              zoom={props.zoom}
            >
              {
                  props.locations.map(item => {
                      return (
                          <Marker key={item.company.name}
                                  position={item.location}
                                  icon={<RoomIcon color="secondary" />}
                                  onClick={() => onSelect(item)}
                          />
                      )
                  })
              }
              { selected.location && (
                  <>
                    <InfoWindow
                      position={selected.location}
                      clickable={true}
                      onCloseClick={() => setSelected({})}
                    >
                      <><h3>{selected.company.name}</h3>{selected.company.address}</>
                    </InfoWindow>
                  </>
              )}
            </GoogleMap>
          }
        </>
    )
}

export default React.memo(MapContainer)
