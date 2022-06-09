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
import {IGroupMembers} from '~/interfaces/IGroup';
import MemberItem from '../../components/MemberItem';

interface MemberListProps {
  canManageMember: boolean;
  onLoadMore: () => void;
  onPressMenu: (item: IGroupMembers) => void;
  onRefresh?: () => void;
}

const MemberList = ({
  canManageMember,
  onLoadMore,
  onPressMenu,
  onRefresh,
}: MemberListProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);
  const [sectionList, setSectionList] = useState([]);

  const groupMembers = useKeySelector(groupsKeySelector.groupMembers);
  const {loading, canLoadMore} = groupMembers || {};

  useEffect(() => {
    if (groupMembers) {
      const newSectionList: any = [];

      Object.values(groupMembers)?.map((roleData: any) => {
        const section: any = {};
        const {name, data} = roleData || {};

        if (name && data) {
          section.title = `${roleData.name}s`;
          section.data = roleData.data;
          section.user_count = roleData.user_count;
          newSectionList.push(section);
        }
      });

      setSectionList(newSectionList);
    }
  }, [groupMembers]);

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
