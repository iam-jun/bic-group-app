import {
  View,
  SectionList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import Text from '~/beinComponents/Text';
import MemberItem from './MemberItem';
import {getMembersSection} from '../redux/selectors';
import appConfig from '~/configs/appConfig';

interface MemberListProps {
  type: 'group' | 'community';
  canManageMember: boolean;
  onLoadMore: () => void;
  onPressMenu: (item: any) => void;
  onRefresh?: () => void;
}

const MemberList = ({
  type,
  canManageMember,
  onLoadMore,
  onPressMenu,
  onRefresh,
}: MemberListProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  const memberSectionData = getMembersSection(type);
  const {loading, canLoadMore, sectionList} = memberSectionData;

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
      canLoadMore &&
      sectionList[0]?.data?.length + sectionList[1]?.data?.length > 0
    ) {
      return (
        <View
          testID="member_list.loading_more_indicator"
          style={styles.listFooter}>
          <ActivityIndicator />
        </View>
      );
    }

    return null;
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <MemberItem
        item={item}
        canManageMember={canManageMember}
        onPressMenu={onPressMenu}
      />
    );
  };

  return (
    <SectionList
      testID="member_list"
      style={styles.content}
      sections={sectionList}
      keyExtractor={(item, index) => `member_list_${item.id}_${index}`}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={renderEmpty}
      initialNumToRender={appConfig.recordsPerPage}
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

export default React.memo(MemberList);
