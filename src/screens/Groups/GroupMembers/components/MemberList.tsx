import {
  View,
  SectionList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';

import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {ITheme} from '~/theme/interfaces';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {IGroupMembers} from '~/interfaces/IGroup';
import images from '~/resources/images';

interface MemberListProps {
  onLoadMore: () => void;
  onPressMenu: (e: any, item: IGroupMembers) => void;
  onRefresh?: () => void;
}

const MemberList = ({onLoadMore, onPressMenu, onRefresh}: MemberListProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);
  const [sectionList, setSectionList] = useState([]);

  const {loading, canLoadMore, group_admin, group_member} = useKeySelector(
    groupsKeySelector.groupMembers,
  );

  useEffect(() => {
    const newSectionList: any = [
      {
        title: 'Admins',
        data: group_admin.data,
        user_count: group_admin.user_count,
      },
      {
        title: 'Members',
        data: group_member.data,
        user_count: group_member.user_count,
      },
    ];

    setSectionList(newSectionList);
  }, [group_admin.data, group_member.data]);

  const renderEmpty = () => {
    return !loading ? <NoSearchResult /> : null;
  };

  const renderSectionHeader = ({section: {title, user_count}}: any) => {
    return (
      <View style={styles.sectionHeader}>
        <Text.BodyM
          color={colors.textPrimary}>{`${title} • ${user_count}`}</Text.BodyM>
      </View>
    );
  };

  const renderListFooter = () => {
    if (
      !(
        canLoadMore &&
        // @ts-ignore
        sectionList[0]?.data?.length + sectionList[1]?.data?.length > 0
      )
    )
      return null;

    return (
      <View
        testID="member_list.loading_more_indicator"
        style={styles.listFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderItem = ({item}: {item: IGroupMembers}) => {
    const {fullname, avatar, username} = item || {};

    return (
      <PrimaryItem
        showAvatar
        menuIconTestID={'member_list.item'}
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

  return (
    <SectionList
      testID="member_list"
      style={styles.content}
      sections={sectionList}
      keyExtractor={(item, index) => `section_list_${item}_${index}`}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderListFooter}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{}} />}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={colors.borderDisable}
          />
        ) : undefined
      }
    />
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    content: {
      backgroundColor: colors.background,
    },
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
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default MemberList;
