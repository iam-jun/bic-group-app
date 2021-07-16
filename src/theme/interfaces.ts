export interface ITheme extends ReactNativePaper.Theme {
  colors: IThemeColors,
}

export interface IThemeColors extends ReactNativePaper.ThemeColors{
  primary: string,
  primary1?: string,
  primary2?: string,
  primary3?: string,
  primary4?: string,
  primary5?: string,
  primary6?: string,
  primary7?: string,

  background: string,
  bgFocus?: string,
  bgHover?: string,
  bgDisable?: string,
  bgButtonPrimary?: string,
  bgButtonSecondary?: string,
  border?: string,
  placeholder: string,
  surface: string,
  iconTint?: string,

  link?: string,
  activeLink?: string,
  success?: string,
  error: string,
  warning?: string,

  textPrimary?: string,
  textSecondary?: string,
  textSuccess?: string,
  textDanger?: string,
  textWarning?: string,
  textInfo?: string,
  textDisabled?: string,
  textReversed?: string,

  facebook?: string,
  google?: string,
  apple?: string,
}
