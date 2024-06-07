'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Orders = () => {
    return (
        <ResourceList
            resource={RESOURCES.ORDERS}
            displayFields={[
                { label: 'Date', key: 'date' },
                { label: 'Status', key: 'status' },
            ]}
        />
    );
};

export default Orders;
