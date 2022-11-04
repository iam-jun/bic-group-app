import React from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';

interface Props {
    audiences: any;
    disabled?: boolean;
    onPressAudiences: ()=>void;
}

const ChosenAudiences = ({ audiences, disabled, onPressAudiences }: Props) => {
  const { t } = useBaseHook();

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <ButtonWrapper
      disabled={disabled}
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
      onPress={onPressAudiences}
      testID="create_post_chosen_audiences"
    >
      <Text.BodyM numberOfLines={2} color={theme.colors.neutral40} style={styles.textPostTo}>
        {`${t('post:post_to')} `}
        <Text.BodyMMedium color={theme.colors.neutral60}>{audiences?.count || 0}</Text.BodyMMedium>
        {': '}
        <Text.BodyMMedium color={theme.colors.neutral80} testID="create_post_chosen_audiences.names">{audiences?.names || ''}</Text.BodyMMedium>
      </Text.BodyM>
    </ButtonWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: spacing?.padding.large,
      paddingVertical: spacing?.padding.small,
      alignItems: 'center',
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
    },
    textPostTo: {
    },
  });
};

export default ChosenAudiences;
