'use client';

import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateSupplier = () => {
    return (
        <ResourceCreate
            resource={RESOURCES.SUPPLIERS}
            fields={[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' }
            ]}
        />
    );
};

export default CreateSupplier;
