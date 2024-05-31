'use client';

import ResourceCreate from '../../../components/ResourceCreate';
import { RESOURCES } from '../../../lib/constants';

const CreateReview = () => {
    return (
        <ResourceCreate
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

export default CreateReview;
