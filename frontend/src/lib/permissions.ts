export type AccessRequirement = 'public' | 'authenticated' | 'owner';

type CanAccessOptions = {
  requirement: AccessRequirement;
  isAuthenticated: boolean;
  currentUserId?: number | null;
  ownerId?: number | null;
};

export function canAccess({
  requirement,
  isAuthenticated,
  currentUserId,
  ownerId,
}: CanAccessOptions) {
  if (requirement === 'public') {
    return true;
  }

  if (requirement === 'authenticated') {
    return isAuthenticated;
  }

  return isAuthenticated && currentUserId != null && ownerId != null
    ? currentUserId === ownerId
    : false;
}
