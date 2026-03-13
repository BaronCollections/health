import { describe, expect, it } from 'vitest';

import { canAccess } from './permissions';

describe('canAccess', () => {
  it('allows public access for everyone', () => {
    expect(canAccess({ requirement: 'public', isAuthenticated: false })).toBe(true);
  });

  it('requires authentication for authenticated routes', () => {
    expect(
      canAccess({ requirement: 'authenticated', isAuthenticated: false })
    ).toBe(false);
    expect(
      canAccess({ requirement: 'authenticated', isAuthenticated: true })
    ).toBe(true);
  });

  it('requires ownership for owner routes', () => {
    expect(
      canAccess({
        requirement: 'owner',
        isAuthenticated: true,
        currentUserId: 7,
        ownerId: 9,
      })
    ).toBe(false);

    expect(
      canAccess({
        requirement: 'owner',
        isAuthenticated: true,
        currentUserId: 7,
        ownerId: 7,
      })
    ).toBe(true);
  });
});
