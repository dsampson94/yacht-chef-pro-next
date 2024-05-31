'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Ingredients = () => {
    return (
        <ResourceList
            resource={RESOURCES.INGREDIENTS}
            displayFields={[
                { label: 'Menu Item ID', key: 'menuItemId' },
                { label: 'Name', key: 'name' },
                { label: 'Description', key: 'description' },
                { label: 'Weight', key: 'weight' },
                { label: 'Price', key: 'price' },
                { label: 'Created At', key: 'createdAt' },
                { label: 'Updated At', key: 'updatedAt' }
            ]}
        />
    );
};

export default Ingredients;
