'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Orders = () => {
    return (
        <ResourceList
            resource={RESOURCES.ORDERS}
            displayFields={[
                { label: 'User ID', key: 'userId' },
                { label: 'Date', key: 'date' },
                { label: 'Status', key: 'status' },
                { label: 'Created At', key: 'createdAt' },
                { label: 'Updated At', key: 'updatedAt' }
            ]}
        />
    );
};

export default Orders;
