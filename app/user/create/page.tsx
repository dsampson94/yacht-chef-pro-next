'use client';

import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateUser = () => {
    return (
        <ResourceCreate
            resource={RESOURCES.USERS}
            fields={[
                { label: 'Email', key: 'email' },
                { label: 'Username', key: 'username' },
                { label: 'Password', key: 'password' },
                { label: 'Role', key: 'role' }
            ]}
        />
    );
};

export default CreateUser;
