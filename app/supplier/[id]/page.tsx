'use client';

import { useRouter } from 'next/router';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditSupplier = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <ResourceEdit
            id={id as string}
            resource={RESOURCES.SUPPLIERS}
            fields={[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' }
            ]}
        />
    );
};

export default EditSupplier;
