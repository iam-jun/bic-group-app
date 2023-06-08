import { Mixpanel } from 'mixpanel-react-native';
import { APP_ENV } from '~/configs/appConfig';
import getEnv from '~/utils/env';

const MixPanelProject = {
  STG: '940c17ec8ae6477391b09e8ec5818674',
  PRO: 'b19f72098916e3d81001e6fc258ae185',
};

const appEnv = getEnv('APP_ENV');

class MixPanelManager {
  private mixpanel: Mixpanel;

  public init = async () => {
    let token;
    if (appEnv === APP_ENV.STAGING) {
      token = MixPanelProject.STG;
    } else if (appEnv === APP_ENV.PRODUCTION) {
      token = MixPanelProject.PRO;
    }

    if (!token) return;

    const trackAutomaticEvents = true;
    this.mixpanel = new Mixpanel(token, trackAutomaticEvents);
    this.mixpanel.init().then(() => {
      // eslint-disable-next-line no-console
      console.log('\x1b[32m🐣️ MixPanel initialized\x1b[0m');
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log('\x1b[31m🐣️ MixPanel init error: ', err, '\x1b[0m');
    });
  };

  public updateUser = (userId: string) => {
    if (this.mixpanel && userId) {
      this.mixpanel.identify(userId);
    }
  };

  /**
   * Track the time it took for an action to occur
   * Example: track the time need to upload image:
   * mixpanelManager.startTimingEvent('upload_image');
   * mixpanelManager.trackEvent('upload_image');
   * Remember use the same eventName for startTimingEvent and trackEvent
   * @param eventName
   */
  public startTimingEvent = (eventName: string) => {
    if (this.mixpanel && eventName) {
      this.mixpanel.timeEvent(eventName);
    }
  };

  public trackEvent = (eventName: string, properties?: any) => {
    if (this.mixpanel && eventName) {
      this.mixpanel.track(eventName, properties);
    }
  };

  public resetUser = () => {
    if (this.mixpanel) {
      this.mixpanel.reset();
    }
  };
}

const mixPanelManager = new MixPanelManager();
export default mixPanelManager;
