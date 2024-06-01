'use client';

import { useParams } from 'next/navigation';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditLocation = () => {
    const { id } = useParams();

    return (
        <ResourceEdit
            id={id as string}
            resource={RESOURCES.LOCATIONS}
            fields={[
                { label: 'City', key: 'city', required: true },
                { label: 'Country', key: 'country', required: true },
                { label: 'Suppliers', key: 'suppliers', type: 'multiselect', required: false }
            ]}
        />
    );
};

export default EditLocation;
