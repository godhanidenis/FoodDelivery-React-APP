import React from 'react'
import ReactPDF, { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer'
import { Table, TableHeader, TableBody, TableRow, TableCell, DataTableCell } from '@david.kucsai/react-pdf-table'

const styles = StyleSheet.create({
  body: {
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 0,
  },
  containerHead: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    alignItems: 'stretch',
    backgroundColor: '#fbdf06'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    '@media max-width: 400': {
      flexDirection: 'column',
    },
    marginBottom: 20,
    fontSize: 14
  },
  contentWrap: {
    padding: 15
  },
  rightColumn: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 15,
    '@media max-width: 400': {
      paddingTop: 10,
      paddingLeft: 0,
    },
  },
  leftColumn: {
     flexDirection: 'column',
     width: 170,
     paddingTop: 30,
     paddingRight: 15,
     '@media max-width: 400': {
       width: '100%',
       paddingRight: 0,
     },
     '@media orientation: landscape': {
       width: 200,
     },
   },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
  },
  image: {
    width: '10%',
    padding: 10,
    backgroundColor: '#fbdf06',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pageHeading: {
    background: '#fbdf06',
    width: '100%',
    fontSize: 24,
    margin: '15px'

  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  tableHeading: {
    fontWeight: 'bold',
    fontSize: 12,
    padding: 3,
    backgroundColor: '#efefef'
  },
  tableCell: {
    padding: 3,
    fontSize: 11
  },
  titleDataRow: {
    marginBottom: 5
  }
})

export function GeneratePDF({data, titleData}) {
  console.log("titleData", titleData)
  return (
    <Document>
      <Page style={styles.body} orientation="landscape">
        <View style={styles.containerHead}>
          <View style={styles.image}>
            <Image src="/images/logo_transparent.png" />
          </View>
          <Text style={styles.pageHeading}>Tracking Report</Text>
        </View>
        <View style={styles.contentWrap}>
            <View style={styles.container}>
              <View style={styles.leftColumn}>
                {titleData ? titleData.map((t) => {
                  return (
                      <Text style={styles.titleDataRow}>{t.name}</Text>
                  )
                }) : "No title data"
              }
              </View>
              <View style={styles.rightColumn}>
                {titleData ? titleData.map((t) => {
                    return (
                      <Text style={styles.titleDataRow}>{t.value}</Text>
                    )
                  }) : "No title data"
                }
              </View>
            </View>
          <Table data={data}>
            <TableHeader textAlign={"center"}>
                  <TableCell style={styles.tableHeading}>Donated by</TableCell>
                  <TableCell style={styles.tableHeading}>Product</TableCell>
                  <TableCell style={styles.tableHeading}>Qty</TableCell>
                  <TableCell style={styles.tableHeading}>Expiry date</TableCell>
                  <TableCell style={styles.tableHeading}>Pickup driver</TableCell>
                  <TableCell style={styles.tableHeading}>Arrived WH</TableCell>
                  <TableCell style={styles.tableHeading}>WH Zone</TableCell>
            </TableHeader>
            <TableBody>
                  <DataTableCell style={styles.tableCell} getContent={(r) => r.donated_by}/>
                  <DataTableCell style={styles.tableCell} getContent={(r) => r.product_name}/>
                  <DataTableCell style={styles.tableCell} getContent={(r) => r.actual_quantity}/>
                  <DataTableCell style={styles.tableCell} getContent={(r) => r.expiry_date}/>
                  <DataTableCell style={styles.tableCell} getContent={(r) => r.pickup_driver}/>
                  <DataTableCell style={styles.tableCell} getContent={(r) => r.arrived_warehouse}/>
                  <DataTableCell style={styles.tableCell} getContent={(r) => r.warehouse_zone}/>
            </TableBody>
          </Table>

        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  )
}
