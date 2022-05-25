import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
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
import images from '~/resources/images';

import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import MemberOptionsMenu from './components/MemberOptionsMenu';
import SearchMemberView from './components/SearchMemberView';

const _GroupMembers = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const [sectionList, setSectionList] = useState([]);
  const [searchText, setSearchText] = useState<string>('');
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

  const groupMember = useKeySelector(groupsKeySelector.groupMember);
  const {user_count: userCount} = useKeySelector(
    groupsKeySelector.groupDetail.group,
  );
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );
  const loadingGroupMember = useKeySelector(
    groupsKeySelector.loadingGroupMember,
  );

  const getGroupProfile = () => {
    // in case for refreshing page on web
    Platform.OS === 'web' &&
      groupId &&
      dispatch(groupsActions.getGroupDetail(groupId));
  };

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
    if (!isInternetReachable) {
      setNeedReloadWhenReconnected(true);
      return;
    }

    const isDataEmpty = !groupMember?.group_admin || !groupMember?.group_member;
    if (needReloadWhenReconnected && isDataEmpty) {
      getMembers();
      getGroupProfile();
      setNeedReloadWhenReconnected(false);
    }
  }, [isInternetReachable]);

  useEffect(() => {
    setSearchText('');
  }, [userCount]);

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
    dispatch(groupsActions.clearGroupMembers());
    getMembers();
    getGroupProfile();

    return () => {
      dispatch(groupsActions.clearGroupMembers());
    };
  }, [groupId]);

  const clearSelectedMember = () => setSelectedMember(undefined);

  const onPressMenu = (e: any, item: IGroupMembers) => {
    if (!item || !item.id) return;

    setSelectedMember(item);
    baseSheetRef.current?.open(e?.pageX, e?.pageY);
  };

  const onLoadMore = () => {
    getMembers();
  };

  const onPressSearch = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const renderItem = ({item}: {item: IGroupMembers}) => {
    const {fullname, avatar, username} = item || {};

    return (
      <PrimaryItem
        showAvatar
        menuIconTestID={'group_members.item'}
        style={styles.itemContainer}
        avatar={avatar || images.img_user_avatar_default}
        ContentComponent={
          <Text.H6 numberOfLines={2}>
            {fullname}
            <Text.Subtitle
              color={
                theme.colors.textSecondary
              }>{` @${username}`}</Text.Subtitle>
          </Text.H6>
        }
        onPressMenu={(e: any) => onPressMenu(e, item)}
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

  const _renderLoading = () => {
    if (loadingGroupMember) {
      return (
        <View style={styles.loadingMember}>
          <ActivityIndicator color={colors.borderDisable} />
        </View>
      );
    }
  };

  const checkingEmptyData = (): any[] => {
    return sectionList.filter((item: any) => item?.data.length > 0).length === 0
      ? []
      : sectionList;
  };

  const renderEmpty = () => {
    return !loadingGroupMember ? <NoSearchResult /> : null;
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'groups:title_members'}
        hideBackOnLaptop={rootNavigation?.canGoBack ? false : true}
      />
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

      {_renderLoading()}

      <SectionList
        style={styles.content}
        sections={checkingEmptyData()}
        keyExtractor={(item, index) => `section_list_${item}_${index}`}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{}} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
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
    loadingMember: {
      marginTop: spacing.margin.large,
    },
  });
};

const GroupMembers = React.memo(_GroupMembers);
GroupMembers.whyDidYouRender = true;
export default GroupMembers;
