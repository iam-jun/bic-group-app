import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import BottomSheet from '~/beinComponents/BottomSheet';
import Header from '~/beinComponents/Header';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {chatPermissions, roomTypes} from '~/constants/chat';
import appConfig from '~/configs/appConfig';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IChatUser} from '~/interfaces/IChat';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {ITheme} from '~/theme/interfaces';
import MembersSelection from '../fragments/MembersSelection';
import actions from '../redux/actions';
import * as modalActions from '~/store/modal/actions';

const GroupMembers = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {spacing} = useTheme() as ITheme;
  const {conversation, members, roles} = useChat();
  const {rootNavigation} = useRootNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<IChatUser>();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const baseSheetRef: any = useRef();
  const {user} = useAuth();
  const permissions = conversation.permissions || {};

  useEffect(() => {
    dispatch(actions.getGroupRols());
  }, []);

  useEffect(() => {
    if (roles.data.length > 0) {
      dispatch(actions.resetData('members'));
      dispatch(
        actions.getData(
          'members',
          {
            fields: {customFields: 1},
            query: {
              __rooms: {$eq: conversation._id},
              _id: {$nin: roles.data.map((role: any) => role._id)},
            },
          },
          'users',
        ),
      );
    }
  }, [roles]);

  const loadMoreData = () => dispatch(actions.mergeExtraData('members'));

  const onAddPress = !permissions[chatPermissions.CAN_INVITE]
    ? undefined
    : () => {
        dispatch(actions.clearSelectedUsers());
        rootNavigation.navigate(chatStack.addMembers);
      };

  const onPressMenu = (e: any, user: IChatUser) => {
    setSelectedMember(user);
    baseSheetRef.current?.open(e?.pageX, e?.pageY);
  };

  const searchUsers = (searchQuery: string) => {
    dispatch(actions.resetData('members'));
    dispatch(
      actions.getData(
        'members',
        {
          fields: {customFields: 1},
          query: {
            $and: [
              {__rooms: {$eq: conversation._id}},
              {_id: {$nin: roles.data.map((role: any) => role._id)}},
              {name: {$regex: searchQuery, $options: 'ig'}},
            ],
          },
        },
        'users',
      ),
    );
  };

  const seachHandler = useCallback(
    debounce(searchUsers, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    setSearchQuery(text);
    seachHandler(text);
  };

  const showConfirmations = (user: IChatUser) => {
    dispatch(
      modalActions.showAlert({
        iconName: 'RemoveUser',
        title: i18next.t('chat:modal_confirm_remove_member:title'),
        content: i18next
          .t(`chat:modal_confirm_remove_member:description`)
          .replace('{0}', conversation.name),
        cancelBtn: true,
        onConfirm: () => doRemoveUser(user),
        confirmLabel: i18next.t('chat:button_remove_member'),
      }),
    );
  };

  const doRemoveUser = (user: IChatUser) => {
    dispatch(actions.removeMember(user));
  };

  const onRemovePress = () => {
    if (selectedMember) {
      if (conversation.type === roomTypes.GROUP)
        showConfirmations(selectedMember);
      else doRemoveUser(selectedMember);
    }
    baseSheetRef.current?.close();
  };

  const renderBottomSheet = () => {
    return (
      <BottomSheet
        modalizeRef={baseSheetRef}
        onClosed={() => setSelectedMember(undefined)}
        ContentComponent={
          <View style={styles.bottomSheet}>
            <Icon
              style={styles.marginBottom}
              labelStyle={styles.marginStart}
              icon="UsersAlt"
              size={22}
              label={i18next.t('chat:member_menu:label_view_profile')}
            />
            <Icon
              style={styles.marginBottom}
              labelStyle={styles.marginStart}
              icon="Star"
              size={22}
              label={i18next.t('chat:member_menu:label_set_as_admin')}
            />
            <Icon
              style={styles.marginBottom}
              labelStyle={styles.marginStart}
              icon="iconSend"
              size={22}
              label={i18next.t('chat:member_menu:label_direct_message')}
            />
            {selectedMember?.username !== user.username && (
              <Icon
                style={styles.marginBottom}
                labelStyle={styles.marginStart}
                icon="TrashAlt"
                size={22}
                label={i18next.t(
                  'chat:member_menu:label_remove_from_group_chat',
                )}
                onPress={onRemovePress}
              />
            )}
          </View>
        }
      />
    );
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
        title={i18next.t('chat:title_members')}
        roles={searchQuery ? null : roles}
        loading={members.loading}
        searchInputProps={{
          placeholder: i18next.t('chat:placeholder_members_search'),
          onChangeText: onQueryChanged,
        }}
        onPressMenu={onPressMenu}
        onLoadMore={loadMoreData}
      />
      {renderBottomSheet()}
    </ScreenWrapper>
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    bottomSheet: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing?.padding.base,
    },
    marginBottom: {
      marginBottom: spacing.margin.large,
    },
    marginStart: {
      marginStart: spacing.margin.large,
    },
  });
};

export default GroupMembers;
