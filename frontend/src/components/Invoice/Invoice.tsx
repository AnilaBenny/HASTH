import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

interface InvoiceDocumentProps {
    invoiceData: any;
  }


const InvoiceDocument = ({ invoiceData,user}:any) => (
    
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
          <Image style={styles.logo} src="/images/logo.jpg" />
          <Text style={styles.reportTitle}>Hasth Inc</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
          <View>
            <Text style={styles.invoice}>Invoice</Text>
          </View>
          <View>
            <Text style={styles.addressTitle}>{user.name}</Text>
            <Text style={styles.addressTitle}>{user.address[0].street},{user.address[0].city}</Text>
            <Text style={styles.addressTitle}>{user.address[0].state}-{user.address[0].zipCode}</Text>
          </View>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
          <View style={{ maxWidth: 200 }}>
          <Text>{`${invoiceData.shippingAddress.street}, ${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state}, ${invoiceData.shippingAddress.zipCode}`}</Text>

          </View>
          <Text style={styles.addressTitle}>
            {new Date(invoiceData.createdAt).toLocaleString()}
            </Text>

        </View>
      </View>

      <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
        <View style={[styles.theader, styles.theader2]}>
          <Text>Items</Text>
        </View>
        <View style={styles.theader}>
          <Text>Price</Text>
        </View>
        <View style={styles.theader}>
          <Text>Qty</Text>
        </View>
        <View style={styles.theader}>
          <Text>Amount</Text>
        </View>
      </View>

      {invoiceData.items.map((receipt:any) => (
        <Fragment key={receipt.orderId}>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={[styles.tbody, styles.tbody2]}>
              <Text>{receipt.product.name}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.price}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.quantity}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{(receipt.price * receipt.quantity).toFixed(2)}</Text>
            </View>
          </View>
        </Fragment>
      ))}

      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={styles.total}>
          <Text></Text>
        </View>
        <View style={styles.total}>
          <Text></Text>
        </View>
        <View style={styles.tbody}>
          <Text>Total</Text>
        </View>
        <View style={styles.tbody}>
          <Text>
            {invoiceData.totalAmount}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

const Invoice: React.FC<InvoiceDocumentProps>  = ({ invoiceData }) => {
    const user = useSelector((state: any) => state.user.user);
    
    
  return(<div className="flex justify-center">
    <PDFDownloadLink
      document={<InvoiceDocument invoiceData={invoiceData} user={user}/>}
      fileName="invoice.pdf"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {({ loading }) =>
        loading ? 'Loading document...' : 'Download Invoice'
      }
    </PDFDownloadLink>
  </div>)
};

const styles = StyleSheet.create({
  page: { fontSize: 11, paddingTop: 20, paddingLeft: 40, paddingRight: 40, lineHeight: 1.5, flexDirection: 'column' },

  spaceBetween: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: "#3E3E3E" },

  titleContainer: { flexDirection: 'row', marginTop: 24 },

  logo: { width: 90 },

  reportTitle: { fontSize: 16, textAlign: 'center' },

  addressTitle: { fontSize: 11, fontWeight: 'bold' },

  invoice: { fontWeight: 'bold', fontSize: 20 },

  invoiceNumber: { fontSize: 11, fontWeight: 'bold' },

  address: { fontWeight: 400, fontSize: 10 },

  theader: { marginTop: 20, fontSize: 10, fontWeight: 'bold', paddingTop: 4, paddingLeft: 7, flex: 1, height: 20, backgroundColor: '#DEDEDE', borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

  theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

  tbody: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1, borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

  total: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1.5, borderColor: 'whitesmoke', borderBottomWidth: 1 },

  tbody2: { flex: 2, borderRightWidth: 1 }
});

export default Invoice;
