import { ExtendedTheme } from '@react-navigation/native';
import { HelperType } from './TextInput';

export const getTextHelperColor = (
  theme: ExtendedTheme, type: HelperType,
) => {
  const { colors } = theme;
  const props = {
    error: {
      color: colors.red40,
      flex: 1,
    },
    warning: {
      color: colors.warning,
      flex: 1,
    },
    success: {
      color: colors.success,
      flex: 1,
    },
    secondary: {
      color: colors.neutral40,
      flex: 1,
    },
  };
  return props[type || 'secondary'] || props.secondary;
};
