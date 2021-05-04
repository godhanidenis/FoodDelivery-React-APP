import React from 'react'
import { SimpleTable } from 'components/SimpleTable'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { cartProducts } from 'sampleData/sampleData'

export default function inventoryParcelTable() {
  const columns = [
      { id: 'photo',
        label: 'Photo',
        width: 100,
      },
      { id: 'warehouse',
        label: 'Warehouse',
      },
      { id: 'donor',
        label: 'Donor',
      },
      { id: 'expiry_date',
        label: 'Expiry Date',
      },
      { id: 'qty_available',
        label: 'Qty Available',
      },
      { id: 'add_qty',
        label: 'Add Qty',
      },
      { id: 'add_to_cart',
        label: '',
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
