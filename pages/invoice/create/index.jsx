'use client';

import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Container, Grid, Paper, Step, StepButton, StepLabel, Stepper } from '@mui/material';
import InvoicePDF from '@/components/invoices/default';
import dynamic from 'next/dynamic';
import InvoiceUserCompanyDetailsForm from '@/components/invoices/components/InvoiceUserCompanyDetailsForm';
import InvoiceDetailsForm from '@/components/invoices/components/InvoiceDetailsForm';
import InvoiceClientDetailsForm from '@/components/invoices/components/InvoiceClientDetailsForm';
import InvoiceItemsForm from '@/components/invoices/components/InvoiceItemsForm';

const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    { ssr: false }
);

const InvoiceCreatePage = () => {
    const steps = ['Invoice Details', 'Invoice Items', 'Company Details', 'Client Details'];
    const [completedSteps, setCompletedSteps] = useState({});

    const [activeStep, setActiveStep] = useState(0);
    const [items, setItems] = useState([{ name: '', amount: '' }]);
    const [taxRate, setTaxRate] = useState(0.1);
    const [showItems, setShowItems] = useState(false);

    const [userName, setUserName] = useState('');
    const [clientName, setClientName] = useState('');
    const [invoiceName, setInvoiceName] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');

    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
    });

    const [companyDetails, setCompanyDetails] = useState({
        name: '',
        taxId: '',
        address: '',
        email: '',
        phoneNumber: '',
        website: '',
        logo: ''
    });

    const [clientDetails, setClientDetails] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        billingAddress: '',
        shippingAddress: '',
        contactPerson: ''
    });

    const handleItemChange = (index, key, value) => {
        const newItems = [...items];
        newItems[index][key] = value;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { name: '', amount: '' }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const calculateSubtotal = () => {
        return items.reduce((total, item) => total + parseFloat(item.amount || 0), 0);
    };

    const calculateTaxAmount = () => {
        return calculateSubtotal() * taxRate;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTaxAmount();
    };

    const handleSaveForm = () => handleComplete(activeStep);

    const handleStep = (step) => () => {
        const newCompletedSteps = { ...completedSteps, [activeStep]: true };
        setCompletedSteps(newCompletedSteps);
        setActiveStep(step);
    };

    const [completed, setCompleted] = useState({});

    const handleComplete = (step) => {
        const newCompleted = { ...completed, [step]: true };
        setCompleted(newCompleted);
        if (step < steps.length - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <InvoiceDetailsForm userName={ userName }
                                           setUserName={ setUserName }
                                           clientName={ clientName }
                                           setClientName={ setClientName }
                                           invoiceName={ invoiceName }
                                           setInvoiceName={ setInvoiceName }
                                           invoiceNumber={ invoiceNumber }
                                           setInvoiceNumber={ setInvoiceNumber }
                                           onFormSave={ handleSaveForm } />;
            case 1:
                return <InvoiceItemsForm items={ items }
                                         onAddItem={ handleAddItem }
                                         onItemChange={ handleItemChange }
                                         onRemoveItem={ handleRemoveItem }
                                         onFormSave={ handleSaveForm } />;
            case 2:
                return <InvoiceUserCompanyDetailsForm userDetails={ userDetails }
                                                      setUserDetails={ setUserDetails }
                                                      companyDetails={ companyDetails }
                                                      setCompanyDetails={ setCompanyDetails }
                                                      onFormSave={ handleSaveForm } />;
            case 3:
                return <InvoiceClientDetailsForm clientDetails={ clientDetails }
                                                 setClientDetails={ setClientDetails }
                                                 onFormSave={ handleSaveForm } />;
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container maxWidth="xxl" sx={ { p: 2, overflow: 'hidden', maxHeight: 'auto' } }>

            {/* Main content */ }
            <Paper elevation={ 4 } sx={ { overflowY: 'auto', p: 2, borderRadius: '8px', boxShadow: '0px 0px 16px black', maxHeight: '80vh' } }>
                <Grid container spacing={ 2 }>
                    {/* Left container for forms */ }
                    <Grid item display="flex" flexDirection="row" xs={ 12 } md={ 8 }>
                        {/* Stepper */ }
                        <Stepper nonLinear activeStep={ activeStep } orientation="vertical" sx={ {  minWidth: '160px' } }>
                            { steps.map((label, index) => (
                                <Step key={ label } completed={ !!completed[index] }>
                                    <StepButton onClick={ handleStep(index) }>
                                        <StepLabel>{ label }</StepLabel>
                                    </StepButton>
                                </Step>
                            )) }
                        </Stepper>

                        { getStepContent(activeStep) }
                    </Grid>

                    {/* Right container for PDF preview */ }
                    <Grid item xs={ 12 } md={ 4 }>
                        <PDFViewer width="100%" height="300px">
                            <InvoicePDF invoiceData={ {
                                invoiceNumber,
                                invoiceName,
                                clientName,
                                items,
                                subtotal: calculateSubtotal(),
                                taxRate,
                                taxAmount: calculateTaxAmount(),
                                total: calculateTotal()
                            } } />
                        </PDFViewer>
                    </Grid>
                </Grid>
            </Paper>

            {/* Download link */ }
            { clientName && items.length > 0 && (
                <PDFDownloadLink document={ <InvoicePDF
                    invoiceData={ { clientName, items, subtotal: calculateSubtotal(), taxRate, taxAmount: calculateTaxAmount(), total: calculateTotal() } } /> }
                                 fileName="invoice.pdf">
                    { ({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF') }
                </PDFDownloadLink>
            ) }
        </Container>
    );
};

export default InvoiceCreatePage;
