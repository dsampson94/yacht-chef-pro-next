'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Ingredients = () => {
    return (
        <ResourceList
            resource={RESOURCES.INGREDIENTS}
            displayFields={[
                { label: 'Name', key: 'name' },
                { label: 'Description', key: 'description' },
                { label: 'Weight', key: 'weight' },
                { label: 'Price', key: 'price' },
            ]}
        />
    );
};

export default Ingredients;
