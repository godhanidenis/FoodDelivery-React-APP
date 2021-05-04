import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { map, get } from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import { LayoutContext } from './Root'

export const getAddressOptions = (addresses) => {
    return map(addresses, function(x) { return {value: x.id,
                                                label: <InlineAddress address={x} />}
                                      }
              )
}

export const InlineAddress = ({address}) => {
    return (
        <div>
          <span>{address.address_type}</span>:
          <span>{address.street1}</span>&nbsp;
          <span>{address.street2}</span>&nbsp;
          <span>{address.city_name}</span>&nbsp;
          <span>{address.province_name}</span>&nbsp;
        </div>
    )
}
