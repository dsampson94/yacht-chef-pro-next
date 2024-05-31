'use client';

import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateMenuItem = () => {
    return (
        <ResourceCreate
            resource={RESOURCES.MENU_ITEMS}
            fields={[
                { label: 'Menu ID', key: 'menuId' },
                { label: 'Name', key: 'name' },
                { label: 'Description', key: 'description' },
                { label: 'Created At', key: 'createdAt', type: 'date' },
                { label: 'Updated At', key: 'updatedAt', type: 'date' }
            ]}
        />
    );
};

export default CreateMenuItem;
