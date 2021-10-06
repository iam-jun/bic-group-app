import i18next from 'i18next';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';

interface Props {
  visible?: boolean;
  count: number;
  time: string;
  onClosePress: () => void;
  onPress: () => void;
}

const UnreadBanner = ({visible, count, time, onClosePress, onPress}: Props) => {
  if (!visible) return null;

  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  return (
    <ButtonWrapper contentStyle={styles.container} onPress={onPress}>
      <Text.BodyM color={theme.colors.textReversed}>{`${
        count > 99 ? '99+' : count
      } ${i18next.t('chat:label_unread_messages_banner')} ${time}`}</Text.BodyM>
      <Icon
        tintColor={theme.colors.textReversed}
        icon="iconClose"
        onPress={onClosePress}
      />
    </ButtonWrapper>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.primary5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
  });
};

export default UnreadBanner;
