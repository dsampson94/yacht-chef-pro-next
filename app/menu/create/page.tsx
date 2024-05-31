'use client';

import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateMenu = () => {
    return (
        <ResourceCreate
            resource={RESOURCES.MENUS}
            fields={[
                { label: 'Chef ID', key: 'chefId' },
                { label: 'Week of Year', key: 'weekOfYear', type: 'number' },
                { label: 'Created At', key: 'createdAt', type: 'date' },
                { label: 'Updated At', key: 'updatedAt', type: 'date' }
            ]}
        />
    );
};

export default CreateMenu;
