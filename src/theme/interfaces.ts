export interface ExtendedTheme extends ReactNativePaper.Theme {
  dark: boolean;
  colors: ExtendedThemeColors;
  spacing: ISpacing;
  dimension: IDimension;
  shadow?: any;
  fontFamily?: any;
  fonts: any;
  animation: any;
}

export interface ExtendedThemeColors extends ReactNativePaper.ThemeColors {
  transparent?: string;
  transparent1?: string;
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
  bgError?: string;
  borderFocus?: string;
  borderDisable?: string;
  borderCard?: string;
  borderDivider?: string;
  textInput?: string;
  placeholder: string;
  surface: string;
  iconTint?: string;
  iconTintLight?: string;
  iconTintReversed?: string;

  link?: string;
  activeLink?: string;
  success?: string;
  error: string;
  warning?: string;
  statusOrange?: string;

  textPrimary?: string;
  textSecondary?: string;
  textTertiary?: string;
  textSuccess?: string;
  textDanger?: string;
  textWarning?: string;
  textInfo?: string;
  textDisabled?: string;
  textReversed?: string;

  facebook?: string;
  google?: string;
  apple?: string;

  badgeActive?: string;
  badgeInfo?: string;
  badgeError?: string;
  badgeBackgroundActive?: string;
  badgeBackgroundInfo?: string;
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
  bottomBarHeight: number;
  deviceWidth: number;
  deviceHeight: number;
}
