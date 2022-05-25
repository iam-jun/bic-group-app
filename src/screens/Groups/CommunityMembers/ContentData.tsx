import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';

import {ICommunityMembers} from '~/interfaces/ICommunity';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import MemberItem from '../components/MemberItem';

interface ContentDataProps {
  style?: StyleProp<ViewStyle>;
  sectionList: any[];
  loading: boolean;
  canLoadMore: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onPressChat?: () => void;
}

const ContentData = ({
  style,
  sectionList,
  loading,
  canLoadMore,
  onRefresh,
  onLoadMore,
  onPressChat,
}: ContentDataProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {colors} = theme;

  const renderSectionHeader = ({section: {title, user_count}}: any) => {
    return (
      <View style={styles.sectionHeader}>
        <Text.BodyM
          color={colors.textPrimary}>{`${title} • ${user_count}`}</Text.BodyM>
      </View>
    );
  };

  const renderItem = ({item}: {item: ICommunityMembers}) => {
    return <MemberItem item={item} onPressChat={onPressChat} />;
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
        testID="content_data.loading_more_indicator"
        style={styles.listFooter}>
        <ActivityIndicator />
      </View>
    );
  };

  return (
    <SectionList
      testID="content_data.list"
      style={[styles.content, style]}
      sections={sectionList}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item, index) => `section_list_${item}_${index}`}
      stickySectionHeadersEnabled={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderListFooter}
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

export default ContentData;

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
