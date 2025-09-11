// Export specific items from each store to avoid naming conflicts

// Auth Store exports
export {
    $user,
    $session,
    $loading as $authLoading,
    $error as $authError,
    $isAuthenticated,
    $userEmail,
    $userId,
    $isPremium,
    authActions
} from './authStore';

// Cards Store exports
export {
    $cards,
    $selectedCard,
    $loading as $cardsLoading,
    $error as $cardsError,
    $cardsCount,
    $activeCards,
    $totalScans,
    $canCreateCard,
    cardsActions
} from './cardsStore';

// Contacts Store exports
export {
    $contacts,
    $selectedContact,
    $loading as $contactsLoading,
    $error as $contactsError,
    $searchQuery,
    $selectedTags,
    $contactsCount,
    $filteredContacts,
    $allTags,
    $recentContacts,
    contactsActions
} from './contactsStore';