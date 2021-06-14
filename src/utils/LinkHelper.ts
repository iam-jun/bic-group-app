import {Linking, Platform} from 'react-native';
// import InAppBrowser from 'react-native-inappbrowser-reborn';

export const sendEmail = async (email: string) => {
  let emailIntent = `mailto:${email}`;

  try {
    const supported = await Linking.canOpenURL(emailIntent);
    if (!supported) throw new Error('Email is not available');

    return Linking.openURL(emailIntent);
  } catch (err) {
    console.log(err);
  }
};
