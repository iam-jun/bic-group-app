import React, {useState, useCallback, useEffect} from 'react';
import {I18nManager, StatusBar, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';

/* State Redux */
import {useSelector, useDispatch} from 'react-redux';
import {languageSelector} from '~/store/language/selectors';
import {fetchSetting} from '~/store/common/actions';
import {fontConfig} from '~/configs/fonts';

/* Theme */
import {
  configureFonts,
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
  Provider as ThemeProvider,
} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {colors, fonts, spacing, dimension, shadow} from '~/theme/configs';
import {PreferencesContext} from '~/contexts/PreferencesContext';
import RootNavigator from '~/router';

export default () => {
  const [stateCurrent, setState] = useState({isUpdate: false, loaded: false});

  /* Localization */
  const {i18n} = useTranslation();

  /*Declare redux and sagas*/
  const dispatch = useDispatch();
  const language = useSelector(state => languageSelector(state));

  /* Change language */
  if (i18n.language !== language) {
    i18n.changeLanguage(language);
  }

  /* Theme Setup */
  const colorScheme = useColorScheme();
  const [theme, switchTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );
  const barStyle = 'dark-content';

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme],
  );

  useEffect(() => {
    setupResource();
  }, []);

  const setupResource = async () => {
    let stateNew = {
      isUpdate: false,
      loaded: false,
    };
    try {
      /*Fetch setting*/
      dispatch(fetchSetting());

      /*Set loading success*/
      stateNew.loaded = true;
      setState(stateNew);
    } catch (error) {
      console.error(`Setup error : ${error}`);
    }
  };

  const toggleTheme = () => {
    switchTheme((theme: string) => (theme === 'light' ? 'dark' : 'light'));
  };

  //Set config theme
  let themeConfig: any =
    theme === 'light'
      ? {
          ...DefaultTheme,
          colors: {...DefaultTheme.colors, ...colors.light.colors},
        }
      : {
          ...DarkTheme,
          colors: {...DarkTheme.colors, ...colors.dark.colors},
        };
  themeConfig.fontFamily = stateCurrent.loaded ? fonts : DefaultTheme.fonts;
  themeConfig.spacing = {...spacing};
  themeConfig.dimension = {...dimension};
  themeConfig.shadow = {...shadow};
  /*Config font*/
  themeConfig.fonts = configureFonts(fontConfig);

  return (
    <ThemeProvider>
      <StatusBar
        translucent
        barStyle={barStyle}
        backgroundColor="transparent"
      />
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider theme={themeConfig}>
          <RootNavigator />
        </PaperProvider>
      </PreferencesContext.Provider>
    </ThemeProvider>
  );
};
