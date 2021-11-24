import i18next from 'i18next';
import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {roomTypes} from '~/constants/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';

const EditConversationDescription = ({route}: {route: any}) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const roomId = route?.params?.roomId || '';
  const conversation = useKeySelector(`chat.rooms.items.${roomId}`) || {};
  const {rootNavigation} = useRootNavigation();

  const [text, setText] = useState<string>(conversation?.description || '');
  const _onChangeText = (value: string) => {
    setText(value);
  };

  const onSave = () => {
    dispatch(
      actions.updateConversationDetail({
        roomId:
          conversation?.type === roomTypes.GROUP
            ? conversation.beinGroupId
            : conversation._id,
        body: {description: text.trim() ? text.trim() : null},
        editFieldName: i18next.t('chat:text_chat_description'),
        callback: onPressBack,
      }),
    );
  };

  const onPressBack = (_roomId?: number | string) => {
    if (rootNavigation.canGoBack) rootNavigation.goBack();
    else
      rootNavigation.replace(chatStack.conversationDetail, {
        roomId: _roomId || roomId,
      });
  };

  return (
    <ScreenWrapper testID="EditConversationDescription" isFullView>
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
          style={styles.textEdit}
          value={text}
          onChangeText={_onChangeText}
          multiline
        />
      </View>
    </ScreenWrapper>
  );
};

export default EditConversationDescription;

const themeStyles = (theme: ITheme) => {
  const {spacing, colors, dimension} = theme;

  return StyleSheet.create({
    content: {
      margin: spacing.margin.large,
      borderRadius: 6,
      borderWidth: 1,
      borderBottomColor: colors.textPrimary,
      padding: spacing.margin.base,
      minHeight: 224,
    },
    textEdit: {
      minHeight: 224,
      fontFamily: fontFamilies.Segoe,
      fontSize: dimension.sizes.body,
      color: colors.textPrimary,
    },
  });
};
