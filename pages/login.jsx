'use client';

import { Box, Button, Checkbox, Container, FormControlLabel, Tab, Tabs, TextField, Typography } from '@mui/material';
import logo from './../src/images/logo-transparent.png';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={ value !== index }
            id={ `simple-tabpanel-${ index }` }
            aria-labelledby={ `simple-tab-${ index }` }
            { ...other }
        >
            { value === index && (
                <Box sx={ { p: 1 } }>
                    { children }
                </Box>
            ) }
        </div>
    );
}

const LoginPage = () => {
    const [value, setValue] = useState(0);
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpUsername, setSignUpUsername] = useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSignInSubmit = (event) => {
        event.preventDefault();
        console.log('Signing in with', signInEmail, signInPassword);
        // Add your sign-in logic here
    };

    const handleSignUpSubmit = (event) => {
        event.preventDefault();
        console.log('Signing up with', signUpEmail, signUpPassword, signUpUsername);
        // Add your sign-up logic here
    };

    return (
        <Container sx={ { backgroundColor: 'white', borderRadius: '8px', boxShadow: 4 } } component="main" maxWidth="xs">
            <Box
                sx={ {
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                } }
            >
                <Image src={ logo } alt="Logo" width={ 80 } height={ 80 } priority />
                <Typography component="h1" variant="h5">
                </Typography>
                <Tabs value={ value } onChange={ handleChange } centered>
                    <Tab label="Sign In" />
                    <Tab label="Sign Up" />
                </Tabs>
                <TabPanel value={ value } index={ 0 }>
                    <Box component="form" onSubmit={ handleSignInSubmit } noValidate sx={ { mt: 1 } }>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="signInEmail"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={ signInEmail }
                            onChange={ (e) => setSignInEmail(e.target.value) }
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="signInPassword"
                            autoComplete="current-password"
                            value={ signInPassword }
                            onChange={ (e) => setSignInPassword(e.target.value) }
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label={<Typography color="primary">Remember me</Typography>}
                            />
                            <Typography color="primary" component="span">
                                <Link href="#" passHref>
                                    Forgot password?
                                </Link>
                            </Typography>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={ { mt: 3, mb: 2 } }
                        >
                            Sign In
                        </Button>
                    </Box>
                </TabPanel>
                <TabPanel value={ value } index={ 1 }>
                    <Box component="form" onSubmit={ handleSignUpSubmit } noValidate sx={ { mt: 1 } }>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="signUpUsername"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={ signUpUsername }
                            onChange={ (e) => setSignUpUsername(e.target.value) }
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="signUpEmail"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={ signUpEmail }
                            onChange={ (e) => setSignUpEmail(e.target.value) }
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="signUpPassword"
                            autoComplete="new-password"
                            value={ signUpPassword }
                            onChange={ (e) => setSignUpPassword(e.target.value) }
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={ { mt: 3, mb: 2 } }
                        >
                            Sign Up
                        </Button>
                    </Box>
                </TabPanel>
            </Box>
        </Container>
    );
};

export default LoginPage;
