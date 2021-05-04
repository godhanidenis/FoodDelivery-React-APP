import React, {useState, useEffect, useRef} from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Chip } from '@material-ui/core'
import moment from 'moment'
import { union, size, map, includes, forEach, get } from 'lodash'
import Loading from 'components/Loading'

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex"
    },
    chip: {
        margin: theme.spacing(0.5),
        marginTop: "12px"
    },
}))

export default function FilterChips({enhanced_filter}) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const filter_as_objects = enhanced_filter.getFilterAsObjects()

    const addCityChipData = (chip_data) => {
        forEach(get(filter_as_objects, "cities"), (city) => chip_data.push({ type: 'city',
                                                                     value: get(city, "id"),
                                                                     label: `City: ${get(city, "name")}` }))
    }

    const addDateRangeChipData = (chip_data) => {
        const date_format = 'D MMM Y'
        switch(get(filter_as_objects, "date_range_filter_type")) {
            case "single_date":
                chip_data.push({type: 'date',
                                value: { from_date: moment(filter_as_objects.single_date)},
                                label: `Date: ${moment(filter_as_objects.single_date).format(date_format)}`})
                break
            case "date_range":
                chip_data.push({type: 'date',
                                value: { from_date: moment(filter_as_objects.from_date),
                                         to_date: moment(filter_as_objects.to_date),},
                                label: `Date Range: ${moment(filter_as_objects.from_date).format(date_format)} - ${moment(filter_as_objects.to_date).format(date_format)}`})
                break
        }
    }

    const addAnyFieldChipData = (chip_data) => {
        const any_field = get(filter_as_objects, "any_field")
        if ( any_field ) {
            chip_data.push({type: 'any_field',
                            Qvalue: any_field,
                            label: any_field})
        }
    }
    
    const createChipData = () => {
        const chip_data = []
        addCityChipData(chip_data)
        addDateRangeChipData(chip_data)
        addAnyFieldChipData(chip_data)
        return chip_data
    }
    
    const chipData = createChipData()
    
    const onDeleteChip = (chip_data) => {
        if ( chip_data.type === 'city' ) {
            dispatch(enhanced_filter.removeCityFilter(chip_data.value))
        } else if ( chip_data.type === 'date' ) {
            dispatch(enhanced_filter.removeDateFilter())
        } else if ( chip_data.type === 'any_field' ) {
            dispatch(enhanced_filter.removeAnyFieldFilter())
        } else {
            console.error("Unknown chip type", chip_data)
        }
    }

    return (
        <div className={classes.container}>
          {map(chipData, (data, index) => {
              return (
                  <Chip
                    icon={null}
                    label={data.label}
                    onDelete={() => onDeleteChip(data)}
                    className={classes.chip}
                    variant="outlined"
                  />
              )
          })}
        </div>
    )

}
