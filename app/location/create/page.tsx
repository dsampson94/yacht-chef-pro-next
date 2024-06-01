'use client';

import { useMemo } from 'react';
import { useResource } from '../../../lib/hooks/useResource';
import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateLocation = () => {
    const { items: suppliers } = useResource('suppliers');

    const supplierOptions = useMemo(() => {
        return suppliers.map(supplier => ({ id: supplier.id, name: supplier.name }));
    }, [suppliers]);

    return (
        <ResourceCreate
            resource={RESOURCES.LOCATIONS}
            fields={[
                { label: 'City', key: 'city', required: true },
                { label: 'Country', key: 'country', required: true },
                { label: 'Suppliers', key: 'suppliers', type: 'multiselect', options: supplierOptions, required: false }
            ]}
        />
    );
};

export default CreateLocation;
