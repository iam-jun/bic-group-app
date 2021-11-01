import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TextInput from '~/beinComponents/inputs/TextInput';

import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import useChat from '~/hooks/chat';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';

const EditConversationDescription = ({route}: {route: any}) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {conversation} = useChat();
  const {rootNavigation} = useRootNavigation();

  const [text, setText] = useState<string>(conversation?.description);
  const _onChangeText = (value: string) => {
    setText(value);
  };

  const onSave = () => {
    dispatch(
      actions.updateConversationDetail(
        {description: text.trim()},
        i18next.t('chat:text_chat_description'),
        onPressBack,
      ),
    );
  };

  const onPressBack = (roomId?: string) => {
    if (rootNavigation.canGoBack) rootNavigation.goBack();
    else
      rootNavigation.replace(chatStack.conversationDetail, {
        roomId: roomId || route?.params?.roomId,
      });
  };

  return (
    <ScreenWrapper
      testID="EditConversationDescription"
      style={styles.container}
      isFullView>
      <Header
        title={i18next.t('chat:detail_menu.edit_description')}
        buttonText={'common:btn_save'}
        buttonProps={{
          useI18n: true,
          highEmphasis: true,
        }}
        onPressButton={onSave}
        onPressBack={onPressBack}
      />

      <View style={styles.content}>
        <TextInput
          value={text}
          onChangeText={_onChangeText}
          multiline
          // @ts-ignore
          minHeight={224}
        />
      </View>
    </ScreenWrapper>
  );
};

export default EditConversationDescription;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      marginTop: spacing.margin.large,
      marginHorizontal: spacing.margin.large,
    },
    textEdit: {
      marginBottom: spacing.margin.small,
    },
  });
};
