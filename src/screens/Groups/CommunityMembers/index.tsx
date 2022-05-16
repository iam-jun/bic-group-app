import {
  StyleSheet,
  View,
  SectionList,
  RefreshControl,
  Pressable,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';
import {debounce} from 'lodash';

import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {ITheme} from '~/theme/interfaces';
import actions from '~/screens/Groups/redux/actions';
import appConfig from '~/configs/appConfig';
import {ICommunityMembers} from '~/interfaces/ICommunity';
import images from '~/resources/images';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import modalActions from '~/store/modal/actions';

const CommunityMembers = ({route}: any) => {
  const {communityId} = route.params;
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  const [searchText, setSearchText] = useState<string>('');
  const [sectionList, setSectionList] = useState([]);

  const {loading, canLoadMore, communityAdmins, members} = useKeySelector(
    groupsKeySelector.communityMembers,
  );

  const getCommunityMembers = () => {
    dispatch(
      actions.getCommunityMembers({communityId, params: {key: searchText}}),
    );
  };

  useEffect(() => {
    getCommunityMembers();

    return () => {
      dispatch(actions.resetCommunityMembers());
    };
  }, [communityId]);

  useEffect(() => {
    const newSectionList: any = [
      {
        title: 'Admins',
        data: communityAdmins.data,
        total: communityAdmins.total,
      },
      {
        title: 'Members',
        data: members.data,
        total: members.total,
      },
    ];

    setSectionList(newSectionList);
  }, [communityAdmins.data, members.data]);

  const onLoadMore = () => {
    getCommunityMembers();
  };

  const onRefresh = () => {
    dispatch(actions.resetCommunityMembers());
    getCommunityMembers();
  };

  const onPressSearch = () => {
    dispatch(
      modalActions.showSearchModal({
        placeholder: i18next.t('groups:text_search_member'),
      }),
    );
  };

  const searchMember = (searchQuery: string) => {
    dispatch(actions.resetCommunityMembers());
    setSearchText(searchQuery);
    dispatch(
      actions.getCommunityMembers({communityId, params: {key: searchQuery}}),
    );
  };

  const searchHandler = useCallback(
    debounce(searchMember, appConfig.searchTriggerTime),
    [],
  );

  const onSearchMember = (text: string) => {
    searchHandler(text);
  };

  const onPressChat = () => {
    // TODO: add navigate to chat
  };

  const renderSectionHeader = ({section: {title, total}}: any) => {
    return (
      <View style={styles.sectionHeader}>
        <Text.BodyM
          color={colors.textPrimary}>{`${title} • ${total}`}</Text.BodyM>
      </View>
    );
  };

  const renderItem = ({item}: {item: ICommunityMembers}) => {
    const {fullname, avatar, username} = item || {};

    return (
      <PrimaryItem
        showAvatar
        menuIconTestID={'community_members.item'}
        style={styles.itemContainer}
        avatar={avatar || images.img_user_avatar_default}
        avatarProps={{isRounded: true, variant: 'medium'}}
        ContentComponent={
          <Text.Body numberOfLines={1}>
            {fullname}
            <Text.BodyS
              color={theme.colors.textSecondary}>{` @${username}`}</Text.BodyS>
          </Text.Body>
        }
        RightComponent={
          <Icon
            icon={'CommentAltDots'}
            backgroundColor={theme.colors.bgSecondary}
            style={styles.iconChat}
            onPress={onPressChat}
            buttonTestID="community_members.icon_chat.button"
          />
        }
      />
    );
  };

  const renderListFooter = () => {
    if (loading) return null;
    return (
      canLoadMore &&
      communityAdmins.data.length + members.data.length > 0 && (
        <View style={styles.listFooter}>
          <ActivityIndicator />
        </View>
      )
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header titleTextProps={{useI18n: true}} title={'groups:title_members'} />
      <View style={styles.searchBar}>
        <Pressable onPress={onPressSearch} style={styles.searchAndInvite}>
          <View pointerEvents="none">
            <SearchInput
              testID="community_members.search"
              value={searchText}
              placeholder={i18next.t('groups:text_search_member')}
              onChangeText={onSearchMember}
            />
          </View>
        </Pressable>
      </View>

      <SectionList
        style={styles.content}
        sections={sectionList}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => `section_list_${item}_${index}`}
        stickySectionHeadersEnabled={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderListFooter}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={colors.borderDisable}
          />
        }
      />
    </ScreenWrapper>
  );
};

export default CommunityMembers;

const createStyles = (theme: ITheme) => {
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
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchAndInvite: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.base,
      marginVertical: spacing.margin.base,
    },
    content: {
      backgroundColor: colors.background,
    },
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingMember: {
      marginTop: spacing.margin.large,
    },
    iconChat: {
      height: 36,
      width: 36,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.padding.small,
      marginHorizontal: spacing.margin.tiny,
    },
  });
};
