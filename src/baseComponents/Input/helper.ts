import { ExtendedTheme } from '@react-navigation/native';
import { HelperType } from './TextInput';

export const getTextHelperColor = (
  theme: ExtendedTheme, type: HelperType,
) => {
  const { colors } = theme;
  const props = {
    error: {
      color: colors.red40,
    },
    warning: {
      color: colors.warning,
    },
    success: {
      color: colors.success,
    },
    secondary: {
      color: colors.neutral40,
    },
  };
  return props[type || 'secondary'] || props.secondary;
};
