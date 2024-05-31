'use client';

import { useRouter } from 'next/router';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditMenu = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <ResourceEdit
            id={id as string}
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

export default EditMenu;
