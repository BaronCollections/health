'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { trackEvent } from '@/lib/analytics';
import { canAccess, type AccessRequirement } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth';

type GatedActionProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick'
> & {
  children: ReactNode;
  requirement?: AccessRequirement;
  ownerId?: number;
  onAction?: () => void;
  onBlocked?: () => void;
};

export function GatedAction({
  children,
  requirement = 'authenticated',
  ownerId,
  onAction,
  onBlocked,
  type = 'button',
  ...buttonProps
}: GatedActionProps) {
  const user = useAuthStore((state) => state.user);

  const isAllowed = canAccess({
    requirement,
    isAuthenticated: Boolean(user),
    currentUserId: user?.id,
    ownerId,
  });

  return (
    <button
      {...buttonProps}
      type={type}
      onClick={() => {
        if (isAllowed) {
          trackEvent('gated_action_allowed', { requirement });
          onAction?.();
          return;
        }

        trackEvent('gated_action_blocked', { requirement });
        onBlocked?.();
      }}
    >
      {children}
    </button>
  );
}
