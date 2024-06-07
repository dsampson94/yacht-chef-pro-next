'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Users = () => {
    return (
        <ResourceList
            resource={RESOURCES.USERS}
            displayFields={[
                { label: 'Email', key: 'email' },
                { label: 'Username', key: 'username' },
                { label: 'Role', key: 'role' },
            ]}
        />
    );
};

export default Users;
