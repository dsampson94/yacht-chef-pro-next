'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Menus = () => {
    return (
        <ResourceList
            resource={RESOURCES.MENUS}
            displayFields={[
                { label: 'Chef ID', key: 'chefId' },
                { label: 'Week of Year', key: 'weekOfYear' },
                { label: 'Created At', key: 'createdAt' },
                { label: 'Updated At', key: 'updatedAt' }
            ]}
        />
    );
};

export default Menus;
