import useAuthController from '~/screens/auth/store';
import mixPanelManager from '~/services/mixpanel';

export const startTimingEvent = (event: string) => {
  mixPanelManager.startTimingEvent(event);
};

export const trackEvent = ({
  event, properties = {},
  sendWithUserId = false,
}:{event: string, properties?: any, sendWithUserId?:boolean}) => {
  const userId = useAuthController.getState().authUser?.userId;
  const newProperties = sendWithUserId ? { user_id: userId } : { user_id: userId, ...properties };
  mixPanelManager.trackEvent(event, newProperties);
};
