import { useState } from 'react';
import Router from 'next/router';

export default function CreateClient() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        billingAddress: '',
        shippingAddress: '',
        contactPerson: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch('/api/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });
            if (res.ok) {
                Router.push('/clients'); // Redirect to the clients listing page or wherever you like
            } else {
                throw new Error('Failed to create client');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle errors, maybe set an error message in state and display it
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
            />

            <button type="submit">Create Client</button>
        </form>
    );
}
