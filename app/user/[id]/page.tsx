'use client';

import { useParams } from 'next/navigation';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditUser = () => {
    const { id } = useParams();

    if (!id) {
        return <div>Loading...</div>;
    }

    return (
        <ResourceEdit
            id={id as string}
            resource={RESOURCES.USERS}
            fields={[
                { label: 'Email', key: 'email' },
                { label: 'Username', key: 'username' },
                { label: 'Password', key: 'password', type: 'password' },
                { label: 'Role', key: 'role' }
            ]}
        />
    );
};

export default EditUser;
