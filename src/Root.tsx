import React, {useState, useEffect} from 'react';
import {StatusBar, Platform, NativeModules, LogBox} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaProvider} from 'react-native-safe-area-context';

/* Theme */
import {
  configureFonts,
  DarkTheme,
  DefaultTheme,
  Portal,
  Provider as PaperProvider,
  Provider as ThemeProvider,
} from 'react-native-paper';
import {useColorScheme} from 'react-native';

/* State Redux */
import {useDispatch, useSelector} from 'react-redux';
import {useGetStream} from '~/hooks/getStream';
import {fetchSetting} from '~/store/modal/actions';
import {fontConfig} from '~/configs/fonts';

import {colors, fonts, spacing, dimension, shadow} from '~/theme';
import {PreferencesContext} from '~/contexts/PreferencesContext';
import RootNavigator from '~/router';
import AlertModal from './components/modals/AlertModal';
import {AppContext} from './contexts/AppContext';
import {languages, AppConfig} from './configs';
import localStorage from '~/services/localStorage';
import moment from 'moment';
import moments from './configs/moments';

moment.updateLocale('en', moments.en);
moment.updateLocale('vi', moments.vi);

export default (): React.ReactElement => {
  LogBox.ignoreAllLogs();

  const [stateCurrent, setState] = useState({isUpdate: false, loaded: false});

  /* Localization */
  const {i18n} = useTranslation();

  /*Declare redux and sagas*/
  const dispatch = useDispatch();
  // const language = useSelector(state => languageSelector(state));

  /* Theme Setup */
  const colorScheme = useColorScheme();
  const [theme, switchTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  // Init Get Stream
  const user = useSelector((state: any) => state.auth.user);
  const streamClient = useGetStream(user?.feed?.accessToken);

  useEffect(() => {
    if (colorScheme !== theme) toggleTheme();
  }, [colorScheme]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme],
  );

  useEffect(() => {
    setUpResource();
    setUpLanguage();
  }, []);

  /* Change language */
  const setUpLanguage = async () => {
    const language = await localStorage.getLanguage();
    if (language) {
      // @ts-ignore
      i18n.language !== language && i18n.changeLanguage(language);
    } else {
      let systemLocale =
        Platform.OS === 'ios'
          ? NativeModules.SettingsManager.settings.AppleLocale
          : NativeModules.I18nManager.localeIdentifier;

      if (systemLocale && systemLocale.includes('_'))
        systemLocale = systemLocale.split('_')[0];
      else if (systemLocale && systemLocale.includes('-'))
        systemLocale = systemLocale.split('-')[0];

      const isSupportLanguage = Object.keys(languages).find(
        (item: string) => item === systemLocale,
      );

      if (isSupportLanguage) changeLanguage(systemLocale);
      else changeLanguage(AppConfig.defaultLanguage);
    }
  };

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    await localStorage.setLanguage(language);
  };

  const setUpResource = async () => {
    const stateNew = {
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
  const themeConfig: any =
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
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
          translucent
          backgroundColor="transparent"
        />
        <PreferencesContext.Provider value={preferences}>
          <PaperProvider theme={themeConfig}>
            <AppContext.Provider
              value={{
                language: i18n.language,
                changeLanguage,
                streamClient,
              }}>
              <Portal.Host>
                <RootNavigator />
              </Portal.Host>
              <AlertModal />
            </AppContext.Provider>
          </PaperProvider>
        </PreferencesContext.Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};
