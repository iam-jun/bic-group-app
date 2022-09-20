import React, { FC, useEffect } from 'react';
import {
  SectionList,
  SectionListRenderItem,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import CommunityGroupCard from '~/components/CommunityGroupCard';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';
import Divider from '~/beinComponents/Divider';
import groupsActions from '~/storeRedux/groups/actions';
import EmptyScreen from '~/components/EmptyScreen';

type GroupItemProps = {
  id: string;
  section: string;
};

type SectionTitleProps = {
  title: string;
};

type ListEmptyProps = {
  type: 'owner' | 'manage';
};

const GroupItem: FC<GroupItemProps> = ({ id, section }) => {
  const managed = useKeySelector(groupsKeySelector.managed);

  const { owner, manage } = managed;
  const item
    = section === 'discover:owner' ? owner.items[id] : manage.items[id];
  const testID
    = section === 'discover:owner'
      ? `managed_owner_item_${id}`
      : `managed_manage_item_${id}`;

  return <CommunityGroupCard item={item} testID={testID} />;
};

const SectionTitle: FC<SectionTitleProps> = ({ title }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.titleSectionContainer}>
      <Text.H5 useI18n>{title}</Text.H5>
    </View>
  );
};

const ListEmpty: FC<ListEmptyProps> = ({ type }) => {
  const managed = useKeySelector(groupsKeySelector.managed);

  const { manage, owner } = managed;
  const { canLoadMore: canLoadMoreManage } = manage;
  const { canLoadMore: canLoadMoreOwner } = owner;
  const canLoadMoreItem
    = type === 'owner' ? canLoadMoreOwner : canLoadMoreManage;
  const testID = type === 'owner' ? 'list_empty_owner' : 'list_empty_manage';
  const description
    = type === 'owner'
      ? 'discover:you_have_not_owner_community'
      : 'discover:you_have_not_manage_communiy_or_group';

  if (canLoadMoreItem) {
    return null;
  }

  return (
    <View testID={testID}>
      <EmptyScreen icon="searchUsers" description={description} />
    </View>
  );
};

const Managed = () => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const managed = useKeySelector(groupsKeySelector.managed);

  const { isRefresh, owner, manage } = managed;
  const { ids: idsOwner } = owner;
  const { ids: idsManage, canLoadMore, isLoading } = manage;
  const data = [
    {
      title: 'discover:owner',
      data: idsOwner,
    },
    {
      title: 'discover:manage',
      data: idsManage,
    },
  ];

  const onLoadMore = () => {
    if (canLoadMore) {
      dispatch(groupsActions.getManagedCommunityAndGroup());
    }
  };

  const onRefresh = () => {
    dispatch(groupsActions.getManaged({ isRefresh: true }));
  };

  const renderItem: SectionListRenderItem<
    string,
    { title: string; data: string[] }
  > = ({ item, section }) => <GroupItem id={item} section={section.title} />;

  const renderSectionHeader = ({ section: { title } }) => (
    <SectionTitle title={title} />
  );

  const renderSectionFooter = ({ section: { title, data } }) => {
    if (data.length !== 0) return null;

    return <ListEmpty type={title === 'discover:owner' ? 'owner' : 'manage'} />;
  };

  const keyExtractor = (item) => `managed-${item}`;

  const renderListFooter = () => {
    if (!isLoading || !canLoadMore) return <View style={styles.listFooter} />;

    return (
      <View style={styles.listFooter} testID="your_groups.loading_more_indicator">
        <ActivityIndicator />
      </View>
    );
  };

  useEffect(() => {
    dispatch(groupsActions.getManaged({ isRefresh: true }));
  }, []);

  return (
    <SectionList
      sections={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      ItemSeparatorComponent={() => (
        <Divider color="transparent" size={spacing.padding.large} />
      )}
      ListFooterComponent={renderListFooter}
      onEndReached={onLoadMore}
      refreshControl={(
        <RefreshControl
          refreshing={isRefresh}
          onRefresh={onRefresh}
          tintColor={theme.colors.gray40}
        />
      )}
    />
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    titleSectionContainer: {
      padding: spacing.padding.large,
      backgroundColor: colors.gray5,
    },
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default Managed;
