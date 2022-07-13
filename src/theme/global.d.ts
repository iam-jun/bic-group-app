import {DefaultTheme, DarkTheme, Theme} from '@react-navigation/native';

// Override the theme in react native navigation to accept our custom theme props.
declare module '@react-navigation/native' {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      black: string;
      white: string;
      danger: string;
      success: string;
      warning: string;

      neutral1: string;
      neutral5: string;
      neutral10: string;
      neutral20: string;
      neutral30: string;
      neutral40: string;
      neutral50: string;
      neutral60: string;
      neutral70: string;
      neutral80: string;
      neutral90: string;

      gray1: string;
      gray5: string;
      gray10: string;
      gray20: string;
      gray30: string;
      gray40: string;
      gray50: string;
      gray60: string;
      gray70: string;
      gray80: string;
      gray90: string;

      purple1: string;
      purple5: string;
      purple10: string;
      purple20: string;
      purple30: string;
      purple40: string;
      purple50: string;
      purple60: string;

      blue1: string;
      blue5: string;
      blue10: string;
      blue20: string;
      blue30: string;
      blue40: string;
      blue50: string;
      blue60: string;

      red1: string;
      red5: string;
      red10: string;
      red20: string;
      red30: string;
      red40: string;
      red50: string;
      red60: string;

      green1: string;
      green5: string;
      green10: string;
      green20: string;
      green30: string;
      green40: string;
      green50: string;
      green60: string;

      slate1: string;
      slate5: string;
      slate10: string;
      slate20: string;
      slate30: string;
      slate40: string;
      slate50: string;
      slate60: string;

      violet1: string;
      violet5: string;
      violet10: string;
      violet20: string;
      violet30: string;
      violet40: string;
      violet50: string;
      violet60: string;

      turquoise1: string;
      turquoise5: string;
      turquoise10: string;
      turquoise20: string;
      turquoise30: string;
      turquoise40: string;
      turquoise50: string;
      turquoise60: string;

      transparent: string;
      transparent1: string;
    };
  };
  export function useTheme(): ExtendedTheme;
}

// export const light: ExtendedTheme = {
//   dark: false,
//   colors: {
//     ...DefaultTheme.colors,
//     white: '#FFFFFF',
//     danger: '#F64E60',
//     success: '#13B055',

//     neutral1: '#F1F2F8',
//     neutral5: '#E3E6F2',
//     neutral10: '#D6D9EB',
//     neutral20: ' #BAC0DE',
//     neutral30: '#9FA6D1',
//     neutral40: '#838DC3',
//     neutral50: '#424D8A',
//     neutral60: '#353E6E',
//     neutral70: '#282E53',
//     neutral80: '#181C32',
//     neutral90: '#0D0F1C',

//     gray1: '#F4F4F6',
//     gray5: '#E8E9ED',
//     gray10: '#DDDFE4',
//     gray20: '#D1D4DB',
//     gray30: '#BABEC9',
//     gray40: '#A4A9B7',
//     gray50: '#767D93',
//     gray60: '#515667',
//     gray70: '#3F4350',
//     gray80: '#2D3039',
//     gray90: '#1B1D22',

//     purple1: '#F4EFFB',
//     purple5: '#E9DFF6',
//     purple10: '#C9AFE9',
//     purple20: '#B48FE0',
//     purple30: '#9E6FD8',
//     purple40: '#884FCF',
//     purple50: '#7335C0',
//     purple60: '#602CA0',

//     blue1: '#EBF4FF',
//     blue5: '#D6EAFF',
//     blue10: '#ADD5FF',
//     blue20: '#85C0FF',
//     blue30: '#5CABFF',
//     blue40: '#3396FF',
//     blue50: '#007AFF',
//     blue60: '#006CE0',

//     red1: '#FEECED',
//     red5: '#FDD8DC',
//     red10: '#FCC5CA',
//     red20: '#F1999F',
//     red30: '#F0878D',
//     red40: '#F64E60',
//     red50: '#F42A3E',
//     red60: '#E90C22',

//     green1: '#EFFDF4',
//     green5: '#E5F9EC',
//     green10: '#D0F1DB',
//     green20: '#8ED6A4',
//     green30: '#74C18C',
//     green40: '#56B374',
//     green50: '#13B055',
//     green60: '#0E9B49',

//     slate1: '#EEEDFD',
//     slate5: '#DDDAFB',
//     slate10: '#CCC8F9',
//     slate20: '#AAA3F5',
//     slate30: '#8A81F7',
//     slate40: '#7B71F0',
//     slate50: '#6559EE',
//     slate60: '#4334EA',

//     violet1: '#F1F1F9',
//     violet5: '#E3E4F3',
//     violet10: '#D4D6EC',
//     violet20: '#B8BBE0',
//     violet30: '#A1A6DC',
//     violet40: '#959AD1',
//     violet50: '#7F85C7',
//     violet60: '#636ABB',

//     turquoise1: '#EDFDFC',
//     turquoise5: '#DBFAF9',
//     turquoise10: '#B7F5F2',
//     turquoise20: '#93F0EC',
//     turquoise30: '#5DE9E2',
//     turquoise40: '#28E2D8',
//     turquoise50: '#1BC5BD',
//     turquoise60: '#18B4AC',
//   },
// };

// export const dark: ExtendedTheme = {
//   dark: true,
//   colors: {
//     ...DarkTheme.colors,
//     white: '#FFFFFF',
//     danger: '#F64E60',
//     success: '#13B055',

//     neutral1: '#F1F2F8',
//     neutral5: '#E3E6F2',
//     neutral10: '#D6D9EB',
//     neutral20: ' #BAC0DE',
//     neutral30: '#9FA6D1',
//     neutral40: '#838DC3',
//     neutral50: '#424D8A',
//     neutral60: '#353E6E',
//     neutral70: '#282E53',
//     neutral80: '#181C32',
//     neutral90: '#0D0F1C',

//     gray1: '#F4F4F6',
//     gray5: '#E8E9ED',
//     gray10: '#DDDFE4',
//     gray20: '#D1D4DB',
//     gray30: '#BABEC9',
//     gray40: '#A4A9B7',
//     gray50: '#767D93',
//     gray60: '#515667',
//     gray70: '#3F4350',
//     gray80: '#2D3039',
//     gray90: '#1B1D22',

//     purple1: '#F4EFFB',
//     purple5: '#E9DFF6',
//     purple10: '#C9AFE9',
//     purple20: '#B48FE0',
//     purple30: '#9E6FD8',
//     purple40: '#884FCF',
//     purple50: '#7335C0',
//     purple60: '#602CA0',

//     blue1: '#EBF4FF',
//     blue5: '#D6EAFF',
//     blue10: '#ADD5FF',
//     blue20: '#85C0FF',
//     blue30: '#5CABFF',
//     blue40: '#3396FF',
//     blue50: '#007AFF',
//     blue60: '#006CE0',

//     red1: '#FEECED',
//     red5: '#FDD8DC',
//     red10: '#FCC5CA',
//     red20: '#F1999F',
//     red30: '#F0878D',
//     red40: '#F64E60',
//     red50: '#F42A3E',
//     red60: '#E90C22',

//     green1: '#EFFDF4',
//     green5: '#E5F9EC',
//     green10: '#D0F1DB',
//     green20: '#8ED6A4',
//     green30: '#74C18C',
//     green40: '#56B374',
//     green50: '#13B055',
//     green60: '#0E9B49',

//     slate1: '#EEEDFD',
//     slate5: '#DDDAFB',
//     slate10: '#CCC8F9',
//     slate20: '#AAA3F5',
//     slate30: '#8A81F7',
//     slate40: '#7B71F0',
//     slate50: '#6559EE',
//     slate60: '#4334EA',

//     violet1: '#F1F1F9',
//     violet5: '#E3E4F3',
//     violet10: '#D4D6EC',
//     violet20: '#B8BBE0',
//     violet30: '#A1A6DC',
//     violet40: '#959AD1',
//     violet50: '#7F85C7',
//     violet60: '#636ABB',

//     turquoise1: '#EDFDFC',
//     turquoise5: '#DBFAF9',
//     turquoise10: '#B7F5F2',
//     turquoise20: '#93F0EC',
//     turquoise30: '#5DE9E2',
//     turquoise40: '#28E2D8',
//     turquoise50: '#1BC5BD',
//     turquoise60: '#18B4AC',
//   },
// };
