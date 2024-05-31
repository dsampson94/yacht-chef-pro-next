'use client';

import { useRouter } from 'next/router';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditIngredient = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <ResourceEdit
            id={id as string}
            resource={RESOURCES.INGREDIENTS}
            fields={[
                { label: 'Menu Item ID', key: 'menuItemId' },
                { label: 'Name', key: 'name' },
                { label: 'Description', key: 'description' },
                { label: 'Weight', key: 'weight', type: 'number' },
                { label: 'Price', key: 'price', type: 'number' },
                { label: 'Created At', key: 'createdAt', type: 'date' },
                { label: 'Updated At', key: 'updatedAt', type: 'date' }
            ]}
        />
    );
};

export default EditIngredient;
