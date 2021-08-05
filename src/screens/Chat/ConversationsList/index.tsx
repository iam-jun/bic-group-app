import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Divider from '~/components/Divider';
import {useBaseHook} from '~/hooks';
import {IObject} from '~/interfaces/common';
import {IConversation} from '~/interfaces/IChat';

import {spacing} from '~/theme';
import actions from '~/screens/Chat/redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import useChat from '~/hooks/chat';
import Header from '~/beinComponents/Header';
import i18next from 'i18next';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Avatar from '~/beinComponents/Avatar';
import {formatDate} from '~/utils/formatData';
import Text from '~/beinComponents/Text';
import SearchInput from '~/beinComponents/inputs/SearchInput';

const ConversationsList = (): React.ReactElement => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const dispatch = useDispatch();
  const {groups} = useChat();
  const {data, loading} = groups;

  useEffect(() => {
    _getConversations();
  }, []);

  const _getConversations = () => {
    dispatch(actions.resetData('groups'));
    dispatch(actions.getData('groups'));
  };

  const loadMore = () => {
    dispatch(actions.mergeExtraData('groups'));
  };

  const renderItem = ({item}: {item: IConversation; index: number}) => {
    return (
      <PrimaryItem
        title={item.name}
        subTitle={item.lastMessage}
        onPress={() => onChatPress(item)}
        LeftComponent={
          <Avatar.Large style={styles.marginRight} source={item.avatar} />
        }
        RightComponent={
          <View>
            <Text.H6 color={theme.colors.textSecondary}>
              {formatDate(item._updatedAt)}
            </Text.H6>
          </View>
        }
      />
    );
  };

  const onChatPress = (item: IConversation) => {
    dispatch(actions.selectConversation(item));
    rootNavigation.navigate(chatStack.conversation, {id: item._id});
  };

  const onMenuPress = async () => {
    dispatch(actions.clearSelectedUsers());
    rootNavigation.navigate(chatStack.createConversation);
  };

  return (
    <ScreenWrapper style={styles.container} testID="ChatScreen" isFullView>
      <Header
        title={i18next.t('chat:title')}
        hideBack
        menuIcon="iconCreateChat"
        onPressMenu={onMenuPress}
      />
      <SearchInput
        style={styles.inputSearch}
        placeholder={t('chat:placeholder_search')}
      />
      <ListView
        type="chat"
        isFullView
        loading={loading}
        data={data}
        renderItem={renderItem}
        renderItemSeparator={() => <Divider />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    inputSearch: {
      margin: spacing.margin.base,
    },
    marginRight: {
      marginRight: spacing.margin.base,
    },
    item: {
      flex: 1,
      flexDirection: 'row',
    },
  });
};

export default ConversationsList;
