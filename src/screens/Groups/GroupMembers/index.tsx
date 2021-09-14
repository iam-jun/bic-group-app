import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';
import {debounce} from 'lodash';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import BottomSheet from '~/beinComponents/BottomSheet';
import {IUser} from '~/interfaces/IAuth';

const GroupMembers = () => {
  const [sectionList, setSectionList] = useState([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<string>('');

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);
  const {rootNavigation} = useRootNavigation();
  const baseSheetRef: any = useRef();

  //todo handle get data if group data not loaded

  const {id: groupId} =
    useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const groupMember = useKeySelector(groupsKeySelector.groupMember);
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );
  const refreshingGroupPosts = useKeySelector(
    groupsKeySelector.refreshingGroupPosts,
  );

  const getMembers = () => {
    if (groupId) {
      dispatch(
        groupsActions.getGroupMembers({
          groupId,
          params: {key: searchText.trim()},
        }),
      );
    }
  };

  useEffect(() => {
    if (refreshingGroupPosts) setSearchText('');
  }, [refreshingGroupPosts]);

  useEffect(() => {
    if (groupMember) {
      const newSectionList: any = [];

      Object.values(groupMember)?.map((roleData: any) => {
        const section: any = {};
        const {name, data} = roleData || {};
        if (name && data) {
          section.title = `${roleData.name}s (${roleData.user_count})`;
          section.data = roleData.data;
          newSectionList.push(section);
        }
      });
      setSectionList(newSectionList);
    }
  }, [groupMember]);

  useEffect(() => {
    getMembers();
  }, [groupId]);

  useEffect(() => {
    dispatch(groupsActions.clearGroupMembers());
    return () => {
      dispatch(groupsActions.clearGroupMembers());
    };
  }, []);

  // const onPressUser = (userId: string) => {
  //   alert('onPress userId: ' + userId);
  // };

  const onPressMenu = (e: any, userId: string) => {
    setSelectedMember(userId);
    baseSheetRef.current?.open(e?.pageX, e?.pageY);
  };

  const onLoadMore = () => {
    getMembers();
  };

  const renderItem = ({item}: any) => {
    const {id, fullname, avatar, title} = item || {};

    return (
      <PrimaryItem
        showAvatar
        style={styles.itemContainer}
        avatar={avatar}
        title={fullname}
        onPressMenu={(e: any) => onPressMenu(e, id)}
        subTitle={title}
        subTitleProps={{variant: 'subtitle', color: colors.textSecondary}}
      />
    );
  };

  const renderListHeader = () => {
    return null;
  };

  const renderSectionHeader = ({section: {title}}: any) => {
    return (
      <View style={styles.sectionHeader}>
        <Text.H5 color={colors.textSecondary}>{title}</Text.H5>
      </View>
    );
  };

  const renderInviteMemberButton = () => {
    // only admin or moderator can see this button
    return (
      can_manage_member && (
        <ButtonWrapper style={styles.inviteButton} onPress={goInviteMembers}>
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

  const renderBottomSheet = () => {
    return (
      <BottomSheet
        modalizeRef={baseSheetRef}
        onClosed={() => setSelectedMember('')}
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
              icon="iconSend"
              size={22}
              label={i18next.t('chat:member_menu:label_direct_message')}
            />
            {can_manage_member && (
              <>
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
                  icon="TrashAlt"
                  size={22}
                  label={i18next.t(
                    'chat:member_menu:label_remove_from_group_chat',
                  )}
                />
              </>
            )}
          </View>
        }
      />
    );
  };

  const goInviteMembers = () => {
    dispatch(groupsActions.clearSelectedUsers());
    rootNavigation.navigate(groupStack.inviteMembers);
  };

  const searchUsers = (searchQuery: string) => {
    dispatch(groupsActions.clearGroupMembers());
    setSearchText(searchQuery);
    dispatch(
      groupsActions.getGroupMembers({groupId, params: {key: searchQuery}}),
    );
  };

  const searchHandler = useCallback(debounce(searchUsers, 1000), []);

  const onSearchUser = (text: string) => {
    searchHandler(text);
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header titleTextProps={{useI18n: true}} title={'chat:title_members'} />
      <View style={styles.searchAndInvite}>
        <SearchInput
          value={searchText}
          style={styles.inputSearch}
          placeholder={i18next.t('groups:text_search_member')}
          onChangeText={onSearchUser}
        />
        {renderInviteMemberButton()}
      </View>

      <SectionList
        style={styles.content}
        sections={sectionList}
        keyExtractor={(item, index) => `section_list_${item}_${index}`}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={renderListHeader}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{}} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
      {renderBottomSheet()}
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    itemContainer: {
      height: undefined,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.tiny,
    },
    sectionHeader: {
      marginTop: spacing.margin.small,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.base,
    },
    content: {
      backgroundColor: colors.background,
    },
    searchAndInvite: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: spacing.margin.base,
      marginTop: spacing.margin.base,
    },
    inputSearch: {
      flex: 1,
    },
    inviteButton: {
      backgroundColor: colors.bgButtonSecondary,
      padding: spacing.padding.small,
      borderRadius: 6,
      marginLeft: spacing.margin.small,
    },
    iconSmall: {
      marginRight: spacing.margin.small,
    },
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
