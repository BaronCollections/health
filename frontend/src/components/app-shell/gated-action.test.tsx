import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/stores/auth';
import { renderWithProviders } from '@/test/render';

import { GatedAction } from './gated-action';

describe('GatedAction', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, token: null });
  });

  it('calls the blocked callback for guests', async () => {
    const user = userEvent.setup();
    const onAllowed = vi.fn();
    const onBlocked = vi.fn();

    renderWithProviders(
      <GatedAction
        requirement="authenticated"
        onAction={onAllowed}
        onBlocked={onBlocked}
      >
        Save plan
      </GatedAction>
    );

    await user.click(screen.getByRole('button', { name: 'Save plan' }));

    expect(onAllowed).not.toHaveBeenCalled();
    expect(onBlocked).toHaveBeenCalledTimes(1);
  });

  it('calls the allowed callback for authenticated users', async () => {
    const user = userEvent.setup();
    const onAllowed = vi.fn();
    const onBlocked = vi.fn();

    useAuthStore.setState({
      user: {
        id: 7,
        phone: '13800000000',
        nickname: 'Mint',
        avatar: '',
      },
      token: 'token',
    });

    renderWithProviders(
      <GatedAction
        requirement="authenticated"
        onAction={onAllowed}
        onBlocked={onBlocked}
      >
        Save plan
      </GatedAction>
    );

    await user.click(screen.getByRole('button', { name: 'Save plan' }));

    expect(onAllowed).toHaveBeenCalledTimes(1);
    expect(onBlocked).not.toHaveBeenCalled();
  });
});
