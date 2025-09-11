import React, { useEffect, useState } from 'react';
import FullCardView from './FullCardView';
import { Card } from '../../types';

// This component would be used for public card sharing
// In a real app, this would be rendered by your router when someone visits /card/:id

interface PublicCardViewProps {
    cardId: string; // From URL params
}

const PublicCardView: React.FC<PublicCardViewProps> = ({ cardId }) => {
    return (
        <FullCardView
            cardId={parseInt(cardId)}
            isPublic={true}
        />
    );
};

// Example of how this would be used with React Router
// <Route path="/card/:cardId" element={<PublicCardView cardId={params.cardId} />} />

// Or with Next.js
// pages/card/[cardId].tsx would use this component

export default PublicCardView;