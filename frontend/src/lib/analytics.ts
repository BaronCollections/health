export type AnalyticsEventName =
  | 'gated_action_allowed'
  | 'gated_action_blocked'
  | 'language_switched';

type AnalyticsPayload = Record<string, unknown>;
type AnalyticsTracker = (
  eventName: AnalyticsEventName,
  payload?: AnalyticsPayload
) => void;

let tracker: AnalyticsTracker | null = null;

export function setAnalyticsTracker(nextTracker: AnalyticsTracker) {
  tracker = nextTracker;
}

export function clearAnalyticsTracker() {
  tracker = null;
}

export function trackEvent(
  eventName: AnalyticsEventName,
  payload: AnalyticsPayload = {}
) {
  tracker?.(eventName, payload);
}
