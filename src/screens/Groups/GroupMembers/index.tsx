import React, {useState, useEffect, useCallback} from 'react';
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

const GroupMembers = () => {
  const [sectionList, setSectionList] = useState([]);
  const [searchText, setSearchText] = useState<string>('');

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);
  const {rootNavigation} = useRootNavigation();

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
          section.title = `${roleData.name} (${roleData.user_count})`;
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

  const onPressUser = (userId: string) => {
    alert('onPress userId: ' + userId);
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
        onPressMenu={() => onPressUser(id)}
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
        <Text.H6S color={colors.textSecondary}>{title}</Text.H6S>
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
      margin: spacing.margin.base,
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
  });
};

export default GroupMembers;
