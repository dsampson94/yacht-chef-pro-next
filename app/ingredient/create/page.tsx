'use client';

import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateIngredient = () => {
    return (
        <ResourceCreate
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

export default CreateIngredient;
