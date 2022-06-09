import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {IGroupMembers} from '~/interfaces/IGroup';

import Text from '~/beinComponents/Text';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import MemberOptionsMenu from './components/MemberOptionsMenu';
import SearchMemberView from './components/SearchMemberView';
import MemberList from './components/MemberList';

const _GroupMembers = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const [selectedMember, setSelectedMember] = useState<IGroupMembers>();
  const [isOpen, setIsOpen] = useState(false);

  const [needReloadWhenReconnected, setNeedReloadWhenReconnected] =
    useState(false);
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);
  const {rootNavigation} = useRootNavigation();
  const baseSheetRef: any = useRef();

  const {offset} = useKeySelector(groupsKeySelector.groupMembers);
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );

  const getGroupProfile = () => {
    dispatch(groupsActions.getGroupDetail(groupId));
  };

  const getMembers = () => {
    if (groupId) {
      dispatch(groupsActions.getGroupMembers({groupId}));
    }
  };

  useEffect(() => {
    if (!isInternetReachable) {
      setNeedReloadWhenReconnected(true);
      return;
    }

    const isDataEmpty = offset === 0;
    if (needReloadWhenReconnected && isDataEmpty) {
      getMembers();
      getGroupProfile();
      setNeedReloadWhenReconnected(false);
    }
  }, [isInternetReachable]);

  useEffect(() => {
    dispatch(groupsActions.clearGroupMembers());
    getMembers();
    getGroupProfile();

    return () => {
      dispatch(groupsActions.clearGroupMembers());
    };
  }, [groupId]);

  const clearSelectedMember = () => setSelectedMember(undefined);

  const onPressMenu = (item: IGroupMembers) => {
    if (!item || !item.id) return;

    setSelectedMember(item);
    baseSheetRef.current?.open();
  };

  const onLoadMore = () => {
    getMembers();
  };

  const onRefresh = () => {
    getGroupProfile(); // to update can_manage_member when member role changes
    dispatch(groupsActions.clearGroupMembers());
    getMembers();
  };

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const renderInviteMemberButton = () => {
    // only admin or moderator can see this button
    return (
      can_manage_member && (
        <ButtonWrapper
          testID="group_members.invite"
          style={styles.inviteButton}
          onPress={goInviteMembers}>
          <Icon
            style={styles.iconSmall}
            icon={'iconUserPlus'}
            size={22}
            tintColor={theme.colors.primary7}
          />
          <Text.ButtonBase color={theme.colors.primary} useI18n>
            common:text_invite
          </Text.ButtonBase>
        </ButtonWrapper>
      )
    );
  };

  const goInviteMembers = () => {
    dispatch(groupsActions.clearSelectedUsers());
    rootNavigation.navigate(groupStack.inviteMembers, {groupId});
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header titleTextProps={{useI18n: true}} title={'groups:title_members'} />
      <View style={styles.searchBar}>
        <Pressable
          testID="group_members.search"
          onPress={onPressSearch}
          style={styles.searchBtn}>
          <View pointerEvents="none">
            <SearchInput placeholder={i18next.t('groups:text_search_member')} />
          </View>
        </Pressable>
        {renderInviteMemberButton()}
      </View>

      <MemberList
        canManageMember={can_manage_member}
        onLoadMore={onLoadMore}
        onPressMenu={onPressMenu}
        onRefresh={onRefresh}
      />

      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember || {}}
        onOptionsClosed={clearSelectedMember}
      />

      <SearchMemberView
        groupId={groupId}
        isOpen={isOpen}
        onClose={onCloseModal}
        onPressMenu={onPressMenu}
        placeholder={i18next.t('groups:text_search_member')}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    searchBtn: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.base,
      marginVertical: spacing.margin.base,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputSearch: {
      flex: 1,
    },
    inviteButton: {
      backgroundColor: colors.bgButtonSecondary,
      padding: spacing.padding.small,
      borderRadius: 6,
      marginRight: spacing.margin.small,
    },
    iconSmall: {
      marginRight: spacing.margin.small,
    },
  });
};

const GroupMembers = React.memo(_GroupMembers);
GroupMembers.whyDidYouRender = true;
export default GroupMembers;
