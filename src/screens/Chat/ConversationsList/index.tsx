import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {NavigationHeader} from '~/components';
import {useBaseHook} from '~/hooks';
import {IObject} from '~/interfaces/common';
import {IConversation} from '~/interfaces/IChat';
import Divider from '~/components/Divider';
import Input from '~/components/inputs';
import ListView from '~/components/list/ListView';
import ScreenWrapper from '~/components/ScreenWrapper';
import {spacing} from '~/theme';
import {
  generateRandomName,
  generateRandomUser,
  getRandomInt,
} from '~/utils/generator';
import * as actions from '~/screens/Chat/redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import {mainStack} from '~/router/navigator/MainStack/stack';

const ConversationsList = (): React.ReactElement => {
  const data: IConversation[] = Array.from(Array(20).keys()).map(() => ({
    name: generateRandomName(),
    members: [generateRandomUser(), generateRandomUser()],
    unreadCount: getRandomInt(0, 10),
    lastMessage: '',
    updatedAt: '2021-06-20T09:00:29.238335Z',
  }));

  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const dispatch = useDispatch();

  const onChatPress = (item: IConversation) => {
    dispatch(actions.selectConversation(item));
    rootNavigation.navigate(mainStack.conversation);
  };

  return (
    <ScreenWrapper style={styles.container} testID="ChatScreen" isFullView>
      <NavigationHeader title="Chat" rightIcon="iconSettings" />
      <Input
        style={styles.inputSearch}
        roundness="big"
        helperType="info"
        placeholder={t('chat:placeholder_search')}
        right={<TextInput.Icon name={'magnify'} />}
      />
      <ListView
        type="chat"
        isFullView
        data={data}
        onItemPress={onChatPress}
        renderItemSeparator={() => <Divider />}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    inputSearch: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.base,
    },
  });
};

export default ConversationsList;
