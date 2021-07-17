export interface ITheme extends ReactNativePaper.Theme {
  dark: boolean;
  colors: IThemeColors;
  spacing?: ISpacing;
  dimension?: any;
  shadow?: any;
  fontFamily?: any;
  fonts: any;
  animation: any;
}

export interface IThemeColors extends ReactNativePaper.ThemeColors {
  primary: string;
  primary1?: string;
  primary2?: string;
  primary3?: string;
  primary4?: string;
  primary5?: string;
  primary6?: string;
  primary7?: string;

  background: string;
  bgFocus?: string;
  bgHover?: string;
  bgDisable?: string;
  bgButtonPrimary?: string;
  bgButtonSecondary?: string;
  border?: string;
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
  big?: number;
}
