'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const MenuItems = () => {
    return (
        <ResourceList
            resource={RESOURCES.MENU_ITEMS}
            displayFields={[
                { label: 'Name', key: 'name' },
                { label: 'Description', key: 'description' },
            ]}
        />
    );
};

export default MenuItems;
