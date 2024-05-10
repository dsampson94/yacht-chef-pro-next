import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// Define styles for the invoice
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 35,
        paddingHorizontal: 35,
        paddingBottom: 65,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    invoiceTitle: {
        fontSize: 24,
        paddingBottom: 8,
        fontFamily: 'Helvetica-Bold'
    },
    billTo: {
        marginTop: 20,
        paddingBottom: 3,
        fontFamily: 'Helvetica-Bold'
    },
    billToContent: {
        paddingBottom: 3
    },
    section: {
        marginTop: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 2
    },
    description: {
        width: '60%',
        textAlign: 'left'
    },
    rate: {
        width: '20%',
        textAlign: 'right'
    },
    qty: {
        width: '10%',
        textAlign: 'right'
    },
    amount: {
        width: '10%',
        textAlign: 'right',
        fontFamily: 'Helvetica-Bold'
    },
    totalsContainer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: '#000',
        paddingTop: 5,
        alignItems: 'flex-end',
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginVertical: 2,
    },
    totalsLabel: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    totalsValue: {
        fontSize: 11,
        marginLeft: 12,
    },
});

// Create Document Component
const InvoicePDF = ({ invoiceData }) => (
    <Document>
        <Page size="A4" style={ styles.page }>
            {/* Header */ }
            <View style={ styles.header }>
                <Text style={ styles.invoiceTitle }>{ invoiceData.invoiceName || 'Invoice' }</Text>
                <View>
                    <Text>Invoice Number:</Text>
                    <Text>{ invoiceData.invoiceNumber }</Text>
                    <Text>Date:</Text>
                    <Text>{ invoiceData.date }</Text>
                    <Text>Due Date:</Text>
                    <Text>{ invoiceData.dueDate }</Text>
                    <Text>Balance Due:</Text>
                    <Text>{ invoiceData.total }</Text>
                </View>
            </View>

            {/* Bill To */ }
            <View>
                <Text style={ styles.billTo }>Bill To</Text>
                <Text style={ styles.billToContent }>{ invoiceData.clientName }</Text>
                <Text style={ styles.billToContent }>{ invoiceData.clientEmail }</Text>
            </View>

            {/* Invoice Items */ }
            <View style={ styles.section }>
                <View style={ [styles.row, { borderBottomWidth: 1 }] }>
                    <Text style={ styles.description }>Description</Text>
                    <Text style={ styles.rate }>Rate</Text>
                    <Text style={ styles.qty }>Qty</Text>
                    <Text style={ styles.amount }>Amount</Text>
                </View>
                { invoiceData.items.map((item, index) => (
                    <View key={ index } style={ styles.row }>
                        <Text style={ styles.description }>{ item.name }</Text>
                        <Text style={ styles.rate }>{ item.rate }</Text>
                        <Text style={ styles.qty }>{ item.qty }</Text>
                        <Text style={ styles.amount }>{ item.amount }</Text>
                    </View>
                )) }
            </View>

            {/* Total Due */ }
            <View style={styles.totalsContainer}>
                {invoiceData.discount && (
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>Discount:</Text>
                        <Text style={styles.totalsValue}>-{invoiceData.discount}</Text>
                    </View>
                )}

                <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Total:</Text>
                    <Text style={styles.totalsValue}>{invoiceData.total}</Text>
                </View>

                <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Balance Due:</Text>
                    <Text style={styles.totalsValue}>{invoiceData.currency} {invoiceData.balanceDue}</Text>
                </View>
            </View>


        </Page>
    </Document>
);

export default InvoicePDF;
