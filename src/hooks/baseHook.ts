import { useTranslation } from 'react-i18next';

const useBaseHook = () => {
  const { t, i18n } = useTranslation();
  const result: any = {};
  try {
    result.t = t;
    result.i18n = i18n;
  } catch (e) {
    // error
  }
  return result;
};

export default useBaseHook;
