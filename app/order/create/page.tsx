'use client';

import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateOrder = () => {
    return (
        <ResourceCreate
            resource={RESOURCES.ORDERS}
            fields={[
                { label: 'User ID', key: 'userId' },
                { label: 'Date', key: 'date', type: 'date' },
                { label: 'Status', key: 'status', type: 'select', options: ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'] }
            ]}
        />
    );
};

export default CreateOrder;
