import useAuthController from '~/screens/auth/store';
import { trackEvent } from '~/services/tracking';

export const trackEventWithUserId = (event: string, properties?: any) => {
  const userId = useAuthController.getState().authUser?.userId;
  const newProperties = !!properties ? { user_id: userId, ...properties } : { user_id: userId };
  trackEvent(event, newProperties);
};
