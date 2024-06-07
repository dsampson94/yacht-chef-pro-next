'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Menus = () => {
    return (
        <ResourceList
            resource={RESOURCES.MENUS}
            displayFields={[
                { label: 'Week of Year', key: 'weekOfYear' },
            ]}
        />
    );
};

export default Menus;
