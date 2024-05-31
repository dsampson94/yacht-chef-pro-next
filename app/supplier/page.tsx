'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Suppliers = () => {
    return (
        <ResourceList
            resource={RESOURCES.SUPPLIERS}
            displayFields={[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' }
            ]}
        />
    );
};

export default Suppliers;
