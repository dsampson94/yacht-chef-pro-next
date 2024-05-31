'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Reviews = () => {
    return (
        <ResourceList
            resource={RESOURCES.REVIEWS}
            displayFields={[
                { label: 'Chef ID', key: 'chefId' },
                { label: 'Supplier ID', key: 'supplierId' },
                { label: 'Rating', key: 'rating' },
                { label: 'Comment', key: 'comment' },
                { label: 'Created At', key: 'createdAt' },
                { label: 'Updated At', key: 'updatedAt' }
            ]}
        />
    );
};

export default Reviews;
