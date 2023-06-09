import mixPanelManager from '~/services/mixpanel';

export const startTimingEvent = (event: string) => {
  mixPanelManager.startTimingEvent(event);
};

export const trackEvent = (event: string, properties: any) => {
  mixPanelManager.trackEvent(event, properties);
};
