'use client';

import { useParams } from 'next/navigation';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditSupplier = () => {
    const { id } = useParams();

    return (
        <ResourceEdit
            id={id as string}
            resource={RESOURCES.SUPPLIERS}
            fields={[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' }
            ]}
        />
    );
};

export default EditSupplier;
