import {Linking} from 'react-native';
import {getEnv} from '~/utils/env';

export default function openUrl(url, customCallback) {
  if (customCallback) {
    const result = customCallback(url);
    if (url && result && typeof result === 'boolean') {
      openURL(url);
    }
  } else if (url) {
    openURL(url);
  }
}

function openURL(url) {
  if (url.includes(getEnv('SELF_DOMAIN'))) {
    const newUrl = url.replace(getEnv('SELF_DOMAIN'), 'bein://');
    Linking.canOpenURL(newUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(newUrl);
        } else {
          Linking.openURL(url);
        }
      })
      .catch(e => {
        console.log('error when open link:', e);
      });
    return;
  }
  Linking.openURL(url);
}
