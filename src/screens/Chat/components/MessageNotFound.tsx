import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import ChatMessageNotFound from '~/../assets/images/chat_message_not_found.svg';
import ButtonPrimary from '~/beinComponents/Button/ButtonPrimary';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import Text from '~/beinComponents/Text';
import {useRootNavigation} from '~/hooks/navigation';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {ITheme} from '~/theme/interfaces';

const MessageNotFound = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {rootNavigation} = useRootNavigation();

  const onPressBack = async () => {
    rootNavigation.replace(chatStack.conversationList);
  };

  return (
    <View style={styles.container}>
      <SvgIcon
        // @ts-ignore
        source={ChatMessageNotFound}
        width={250}
        height={200}
        tintColor="none"
      />
      <Text.ButtonBase useI18n>chat:title_msg_not_found</Text.ButtonBase>
      <Text useI18n style={styles.description}>
        chat:description_msg_not_found
      </Text>
      <ButtonPrimary
        useI18n
        color={theme.colors.textPrimary}
        style={styles.button}
        onPress={onPressBack}>
        chat:button_go_back_to_chat
      </ButtonPrimary>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.padding.extraLarge,
    },
    button: {
      marginTop: spacing.margin.extraLarge,
    },
    description: {
      textAlign: 'center',
    },
  });
};

export default MessageNotFound;
