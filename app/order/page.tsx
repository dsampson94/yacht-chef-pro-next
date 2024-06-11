'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Orders = () => {
    return (
        <ResourceList
            resource={RESOURCES.ORDERS}
            displayFields={[
                { label: 'Status', key: 'status' },
            ]}
        />
    );
};

export default Orders;
