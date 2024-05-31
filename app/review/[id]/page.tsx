'use client';

import { useRouter } from 'next/router';
import ResourceEdit from '../../../components/ResourceEdit';
import { RESOURCES } from '../../../lib/constants';

const EditReview = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <ResourceEdit
            id={id as string}
            resource={RESOURCES.REVIEWS}
            fields={[
                { label: 'Chef ID', key: 'chefId' },
                { label: 'Supplier ID', key: 'supplierId' },
                { label: 'Rating', key: 'rating', type: 'number' },
                { label: 'Comment', key: 'comment' },
                { label: 'Created At', key: 'createdAt', type: 'date' },
                { label: 'Updated At', key: 'updatedAt', type: 'date' }
            ]}
        />
    );
};

export default EditReview;
