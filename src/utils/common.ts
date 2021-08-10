import {Linking} from 'react-native';

export const generateAvatar = (name?: string, color?: string) => {
  return `https://ui-avatars.com/api/?name=${
    name?.toUpperCase() || ''
  }&background=${color || '4c95ff'}&color=fff&size=128`;
};

export const openLink = async (link: string) => {
  const supported = await Linking.canOpenURL(link);
  if (supported) {
    await Linking.openURL(link);
  } else {
    console.log('\x1b[31m', '🐣️ openLink : cant open url ', '\x1b[0m');
  }
};

export function timeOut(ms?: number) {
  return new Promise(resolve => setTimeout(resolve, ms || 100));
}

export function titleCase(str) {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}
