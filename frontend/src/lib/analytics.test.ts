import { describe, expect, it, vi } from 'vitest';

import {
  clearAnalyticsTracker,
  setAnalyticsTracker,
  trackEvent,
} from './analytics';

describe('trackEvent', () => {
  it('no-ops safely when no tracker is attached', () => {
    clearAnalyticsTracker();

    expect(() =>
      trackEvent('gated_action_blocked', { requirement: 'authenticated' })
    ).not.toThrow();
  });

  it('forwards the event payload when a tracker is attached', () => {
    const tracker = vi.fn();
    setAnalyticsTracker(tracker);

    trackEvent('gated_action_allowed', { requirement: 'authenticated' });

    expect(tracker).toHaveBeenCalledWith('gated_action_allowed', {
      requirement: 'authenticated',
    });
  });
});
