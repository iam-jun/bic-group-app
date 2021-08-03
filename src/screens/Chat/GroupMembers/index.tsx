import i18next from 'i18next';
import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {ITheme} from '~/theme/interfaces';
import MembersSelection from '../fragments/MembersSelection';
import actions from '../redux/actions';

const GroupMembers = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {spacing}: ITheme = useTheme() as ITheme;
  const {conversation, members} = useChat();
  const {rootNavigation} = useRootNavigation();

  useEffect(() => {
    dispatch(actions.getData('members', true, {roomId: conversation._id}));
  }, []);

  const loadMoreData = () => dispatch(actions.mergeExtraData('users'));

  const onAddPress = () => {
    rootNavigation.navigate(chatStack.addMembers);
  };

  const onPressMenu = () => {
    Alert.alert('onMenuPress in development');
  };

  return (
    <ScreenWrapper testID="GroupMembersScreen" isFullView>
      <Header
        title={i18next.t('chat:title_room_members')}
        menuIcon="addUser"
        onPressMenu={onAddPress}
      />
      <ViewSpacing height={spacing.margin.base} />
      <MembersSelection
        data={members.data}
        loading={members.loading}
        searchInputProps={{
          placeholder: i18next.t('chat:placeholder_members_search'),
        }}
        onPressMenu={onPressMenu}
        onLoadMore={loadMoreData}
      />
    </ScreenWrapper>
  );
};

export default GroupMembers;
