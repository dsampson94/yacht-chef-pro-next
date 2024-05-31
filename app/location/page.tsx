'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Locations = () => {
    return (
        <ResourceList
            resource={RESOURCES.LOCATIONS}
            displayFields={[
                { label: 'City', key: 'city' },
                { label: 'Country', key: 'country' }
            ]}
        />
    );
};

export default Locations;
