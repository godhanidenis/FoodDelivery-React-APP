import React from 'react'
import { SimpleTable } from 'components/SimpleTable'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { cartProducts } from 'sampleData/sampleData'

export default function Cart({items}) {
  const columns = [
      { id: 'photo',
        label: '',
        width: 40,
      },
      { id: 'name',
        label: 'Product',
      },
      { id: 'qty',
        label: 'Qty',
      },
  ]
  return(
    <>
    <SimpleTable
      rows={cartProducts}
      columns={columns}
      showPagination={false}
      size={"small"}
    />
    <Grid container justify="flex-end">
      <Button variant="contained" size="small" color="secondary" style={{margin:5}}>Save & Close</Button>
    </Grid>
    </>
  )
}
