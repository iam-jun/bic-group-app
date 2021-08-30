export interface ITheme extends ReactNativePaper.Theme {
  dark: boolean;
  colors: IThemeColors;
  spacing: ISpacing;
  dimension: IDimension;
  shadow?: any;
  fontFamily?: any;
  fonts: any;
  animation: any;
}

export interface IThemeColors extends ReactNativePaper.ThemeColors {
  transparent?: string;
  primary: string;
  primary1?: string;
  primary2?: string;
  primary3?: string;
  primary4?: string;
  primary5?: string;
  primary6?: string;
  primary7?: string;

  background: string;
  bgSecondary?: string;
  bgFocus?: string;
  bgHover?: string;
  bgDisable?: string;
  bgButtonPrimary?: string;
  bgButtonSecondary?: string;
  borderFocus?: string;
  borderDisable?: string;
  borderCard?: string;
  borderDivider?: string;
  textInput?: string;
  placeholder: string;
  surface: string;
  iconTint?: string;
  iconTintReversed?: string;

  link?: string;
  activeLink?: string;
  success?: string;
  error: string;
  warning?: string;

  textPrimary?: string;
  textSecondary?: string;
  textSuccess?: string;
  textDanger?: string;
  textWarning?: string;
  textInfo?: string;
  textDisabled?: string;
  textReversed?: string;

  facebook?: string;
  google?: string;
  apple?: string;
}

export interface ISpacing {
  margin: ISpacingValue;
  padding: ISpacingValue;
  borderRadius: ISpacingValue;
  lineHeight: ISpacingValue;
}

export interface ISpacingValue {
  base?: number;
  tiny?: number;
  small?: number;
  large?: number;
  extraLarge?: number;
  big?: number;
}

export interface IDimension {
  sizes: {[key: string]: number};
  lineHeights: {[key: string]: number};
  dimensionDevice?: {[key: string]: number};
  sizeButton: {[key: string]: number};
  letterSpacing: {[key: string]: number};
  headerHeight: number;
  primaryItemHeight: number;
  avatarSizes: {[key: string]: number};
  commentBarHeight: number;
  maxNewsfeedWidth: number;
  deviceWidth: number;
  deviceHeight: number;
}
