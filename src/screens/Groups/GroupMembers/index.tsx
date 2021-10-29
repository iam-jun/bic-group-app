import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, StyleSheet, SectionList, ActivityIndicator} from 'react-native';
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
import appConfig from '~/configs/appConfig';
import modalActions, {showAlertNewFeature} from '~/store/modal/actions';
import {IObject} from '~/interfaces/common';
import groupsDataHelper from '../helper/GroupsDataHelper';
import {IGroup} from '~/interfaces/IGroup';
import mainStack from '~/router/navigator/MainStack/stack';

import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import BottomSheet from '~/beinComponents/BottomSheet';
import Button from '~/beinComponents/Button';

const GroupMembers = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const [sectionList, setSectionList] = useState([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<IObject<any>>({});
  const clearSelectedMember = () => setSelectedMember({});

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);
  const {rootNavigation} = useRootNavigation();
  const baseSheetRef: any = useRef();

  //todo handle get data if group data not loaded

  const groupMember = useKeySelector(groupsKeySelector.groupMember);
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );
  const loadingGroupMember = useKeySelector(
    groupsKeySelector.loadingGroupMember,
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

  const onPressMenu = (e: any, item: any) => {
    if (!item || !item.id) return;

    setSelectedMember({
      ...item,
    });
    baseSheetRef.current?.open(e?.pageX, e?.pageY);
  };

  const goToUserProfile = () => {
    const {id: userId} = selectedMember;
    rootNavigation.navigate(mainStack.userProfile, {userId});
  };

  const removeMember = (userId: string, userFullname: string) => {
    dispatch(groupsActions.removeMember({groupId, userId, userFullname}));
  };

  const alertRemovingMember = () => {
    if (!selectedMember) {
      dispatch(
        modalActions.showHideToastMessage({
          content: 'No member selected',
          props: {type: 'error'},
        }),
      );
      return;
    }

    const {id: userId, fullname} = selectedMember;

    const content = i18next
      .t(`groups:modal_confirm_remove_member:description`)
      .replace('{name}', `"${fullname}"`);

    const alertPayload = {
      iconName: 'RemoveUser',
      title: i18next.t('groups:modal_confirm_remove_member:title'),
      content: content,
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: colors.primary7,
      },
      onConfirm: () => removeMember(userId, fullname),
      confirmLabel: i18next.t(
        'groups:modal_confirm_remove_member:button_remove',
      ),
      ConfirmBtnComponent: Button.Danger,
    };

    groupsDataHelper
      .getUserInnerGroups(groupId, userId)
      .then(res => {
        const innerGroups = res.data.inner_groups.map(
          (group: IGroup) => group.name,
        );
        const groupsRemovedFrom = [...innerGroups];

        if (groupsRemovedFrom.length === 0) {
          alertPayload.content = alertPayload.content.replace(
            '{other groups}',
            '',
          );
        } else {
          const otherGroups = groupsRemovedFromToString(groupsRemovedFrom);
          alertPayload.content = alertPayload.content.replace(
            '{other groups}',
            ` and ${otherGroups}`,
          );
        }

        dispatch(modalActions.showAlert(alertPayload));
      })
      .catch(err => {
        console.error('Error while fetching user inner groups', err);
        dispatch(
          modalActions.showHideToastMessage({
            content: 'error:http:unknown',
            props: {textProps: {useI18n: true}, type: 'error'},
          }),
        );
      });
  };

  const onPressMenuOption = (
    type: 'view-profile' | 'send-message' | 'set-admin' | 'remove-member',
  ) => {
    baseSheetRef.current?.close();
    switch (type) {
      case 'view-profile':
        goToUserProfile();
        break;
      case 'remove-member':
        alertRemovingMember();
        break;
      default:
        dispatch(showAlertNewFeature());
        break;
    }
  };

  const onLoadMore = () => {
    getMembers();
  };

  const renderItem = ({item}: any) => {
    const {fullname, avatar, title} = item || {};

    return (
      <PrimaryItem
        showAvatar
        style={styles.itemContainer}
        avatar={avatar}
        title={fullname}
        onPressMenu={(e: any) => onPressMenu(e, item)}
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
        onClosed={clearSelectedMember}
        ContentComponent={
          <View style={styles.bottomSheet}>
            <PrimaryItem
              style={styles.menuOption}
              leftIcon={'UsersAlt'}
              leftIconProps={{icon: 'UsersAlt', size: 24}}
              title={i18next.t('groups:member_menu:label_view_profile')}
              onPress={() => onPressMenuOption('view-profile')}
            />
            <PrimaryItem
              style={styles.menuOption}
              leftIcon={'iconSend'}
              leftIconProps={{icon: 'iconSend', size: 24}}
              title={i18next.t('groups:member_menu:label_direct_message')}
              onPress={() => onPressMenuOption('send-message')}
            />
            {can_manage_member && (
              <>
                <PrimaryItem
                  style={styles.menuOption}
                  leftIcon={'Star'}
                  leftIconProps={{icon: 'Star', size: 24}}
                  title={i18next.t('groups:member_menu:label_set_as_admin')}
                  onPress={() => onPressMenuOption('set-admin')}
                />
                <PrimaryItem
                  style={styles.menuOption}
                  leftIcon={'TrashAlt'}
                  leftIconProps={{icon: 'TrashAlt', size: 24}}
                  title={i18next.t(
                    'groups:member_menu:label_remove_from_group',
                  )}
                  onPress={() => onPressMenuOption('remove-member')}
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
    rootNavigation.navigate(groupStack.inviteMembers, {groupId});
  };

  const searchUsers = (searchQuery: string) => {
    dispatch(groupsActions.clearGroupMembers());
    setSearchText(searchQuery);
    dispatch(
      groupsActions.getGroupMembers({groupId, params: {key: searchQuery}}),
    );
  };

  const searchHandler = useCallback(
    debounce(searchUsers, appConfig.searchTriggerTime),
    [],
  );

  const onSearchUser = (text: string) => {
    searchHandler(text);
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
    loadingMember: {
      marginTop: spacing.margin.large,
    },
    bottomSheet: {
      paddingVertical: spacing.padding.tiny,
    },
    menuOption: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default GroupMembers;

const groupsRemovedFromToString = (groupList: string[]) => {
  if (groupList.length === 1) {
    return groupList[0];
  }

  return `${groupList.length} other inner groups: ${groupList.join(', ')}`;
};
