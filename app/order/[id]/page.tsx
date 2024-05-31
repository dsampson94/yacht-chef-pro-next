'use client';

import { useRouter } from 'next/router';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditOrder = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <ResourceEdit
            id={id as string}
            resource={RESOURCES.ORDERS}
            fields={[
                { label: 'User ID', key: 'userId' },
                { label: 'Date', key: 'date', type: 'date' },
                { label: 'Status', key: 'status', type: 'select', options: ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'] }
            ]}
        />
    );
};

export default EditOrder;
