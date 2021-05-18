import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

const useBaseHook = (lang = false, nav = false) => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  let result: any = {};
  if (!lang && !nav) {
    result.t = t;
    result.i18n = i18n;
    result.navigation = navigation;
  }
  if (lang) {
    result.t = t;
    result.i18n = i18n;
  }
  if (nav) {
    result.navigation = navigation;
  }
  return result;
};

export default useBaseHook;
