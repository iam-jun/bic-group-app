export function makeStyleFromTheme(
  getStyleFromTheme: (a: any) => any,
): (a: any) => any {
  let lastTheme: any;
  let style: any;
  return (theme: any) => {
    if (!style || theme !== lastTheme) {
      style = getStyleFromTheme(theme);
      lastTheme = theme;
    }

    return style;
  };
}