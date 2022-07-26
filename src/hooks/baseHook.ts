import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const useBaseHook = () => {
  const { t, i18n } = useTranslation();
  const result: any = {};
  try {
    result.t = t;
    result.i18n = i18n;

    const navigation = useNavigation();

    result.navigation = navigation;
  } catch (e) {
    // error
  }
  return result;
};

export default useBaseHook;
