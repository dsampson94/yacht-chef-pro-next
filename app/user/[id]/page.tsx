'use client';

import { useRouter } from 'next/router';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditUser = () => {
    const router = useRouter();
    const { id } = router.query;

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
