'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const MenuItems = () => {
    return (
        <ResourceList
            resource={RESOURCES.MENU_ITEMS}
            displayFields={[
                { label: 'Menu ID', key: 'menuId' },
                { label: 'Name', key: 'name' },
                { label: 'Description', key: 'description' },
                { label: 'Created At', key: 'createdAt' },
                { label: 'Updated At', key: 'updatedAt' }
            ]}
        />
    );
};

export default MenuItems;
