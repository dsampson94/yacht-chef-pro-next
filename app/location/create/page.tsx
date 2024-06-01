'use client';

import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateLocation = () => {
    return (
        <ResourceCreate
            resource={RESOURCES.LOCATIONS}
            fields={[
                { label: 'City', key: 'city' },
                { label: 'Country', key: 'country' },
                { label: 'Suppliers', key: 'suppliers', type: 'multiselect', required: false }
            ]}
        />
    );
};

export default CreateLocation;
