import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { spacing } from '~/theme';
import Text from '~/beinComponents/Text';
import { ILanguageItem } from '~/interfaces/IEditUser';
import Button from '~/beinComponents/Button';

type LanguageOptionMenuItemProps = {
  language: ILanguageItem;
  onChoose: (language: ILanguageItem) => void;
};

const LanguageOptionMenuItem: FC<LanguageOptionMenuItemProps> = ({
  language,
  onChoose,
}) => {
  const { name, selected } = language;
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <Button
      style={[styles.container, selected && styles.selected]}
      contentStyle={styles.contentContainer}
      onPress={() => onChoose(language)}
    >
      <Text.BodyMMedium>{name}</Text.BodyMMedium>
    </Button>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    selected: {
      backgroundColor: colors.neutral2,
    },
  });
};

export default LanguageOptionMenuItem;
