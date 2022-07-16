import {Linking} from 'react-native';
import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';
import InAppBrowser from 'react-native-inappbrowser-reborn';

async function urlOpener(url: string, redirectUrl: string) {
  await InAppBrowser.isAvailable();
  // @ts-ignore
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success' && newUrl) {
    Linking.openURL(newUrl);
  }
}

export const initAmplify = () => {
  Amplify.configure({
    ...awsconfig,
    oauth: {
      ...awsconfig.oauth,
      urlOpener,
    },
  });
};
