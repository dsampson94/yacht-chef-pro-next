'use client';

import ResourceList from '../../components/ResourceList';
import { RESOURCES } from '../../lib/constants';

const Reviews = () => {
    return (
        <ResourceList
            resource={RESOURCES.REVIEWS}
            displayFields={[
                { label: 'Rating', key: 'rating' },
                { label: 'Comment', key: 'comment' },
            ]}
        />
    );
};

export default Reviews;
