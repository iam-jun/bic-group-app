import i18next from 'i18next';
import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useChat from '~/hooks/chat';
import {ITheme} from '~/theme/interfaces';
import MembersSelection from '../fragments/MembersSelection';
import actions from '../redux/actions';

const GroupMembers = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {spacing}: ITheme = useTheme() as ITheme;
  const {members} = useChat();

  useEffect(() => {
    dispatch(actions.getRoomMembers());
  }, []);

  const onAddPress = () => {
    console.log('onAddPress in development');
  };

  const onPressMenu = () => {
    Alert.alert('onMenuPress in development');
  };

  return (
    <ScreenWrapper testID="CreateConversationScreen" isFullView>
      <Header
        title={i18next.t('chat:title_room_members')}
        menuIcon="addUser"
        onPressMenu={onAddPress}
      />
      <ViewSpacing height={spacing.margin.base} />
      <MembersSelection
        data={members.data}
        searchInputProps={{
          placeholder: i18next.t('chat:placeholder_members_search'),
        }}
        onPressMenu={onPressMenu}
      />
    </ScreenWrapper>
  );
};

export default GroupMembers;
