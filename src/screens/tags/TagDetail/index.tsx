import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { debounce } from 'lodash';
import Header from '~/beinComponents/Header';
import FilterToolbar from '~/components/FilterToolbar';
import useFilterToolbarStore from '~/components/FilterToolbar/store';
import { IPayloadGetSearchPosts } from '~/interfaces/IHome';
import useCommunitiesStore from '~/store/entities/communities';
import useTagDetailStore from './store';
import ContentItem from '~/components/ContentItem';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import appConfig from '~/configs/appConfig';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

const TagDetail: React.FC<any> = ({ route }) => {
  const { params } = route || {};
  const { tagData, communityId = '' } = params || {};
  const { name: tagName, id: tagId } = tagData || {};

  const theme = useTheme();
  const styles = createStyle(theme);

  const filterPostType = useFilterToolbarStore((state) => state.postType);
  const filterCreatedBy = useFilterToolbarStore((state) => state.createdBy);
  const filterDate = useFilterToolbarStore((state) => state.datePosted);
  const resetFilter = useFilterToolbarStore((state) => state.reset);

  const tagActions = useTagDetailStore((state) => state.actions);
  const loading = useTagDetailStore((state) => state.loading);
  const hasNextPage = useTagDetailStore((state) => state.hasNextPage);
  const resetTag = useTagDetailStore((state) => state.reset);
  const articles = useTagDetailStore((state) => state.articles);

  const community = useCommunitiesStore((state) => state.data[communityId]);
  const { groupId, name: communityName } = community || {};

  useEffect(() => {
    resetTag();
    getData();
  }, [filterPostType, filterCreatedBy, filterDate?.startDate, filterDate?.endDate, groupId, tagId]);

  useEffect(() => () => {
    resetTag();
    resetFilter();
  }, [tagId]);

  const getData = (isLoadMore = false) => {
    const payload: IPayloadGetSearchPosts = {
      searchText: '',
      actors: filterCreatedBy?.id,
      startDate: filterDate?.startDate,
      endDate: filterDate?.endDate,
      groupId,
      tagName,
      type: filterPostType,
    };
    tagActions.getArticles(payload, isLoadMore);
  };

  const onLoadMore = debounce(() => {
    getData(true);
  }, appConfig.searchTriggerTime);

  const renderItem = ({ item }: any) => (
    <ContentItem id={item?.id} testID="tag_detail.article" />
  );

  const renderFooter = () => {
    if (hasNextPage && !loading) {
      return <LoadingIndicator style={{ margin: spacing.margin.small }} />;
    }
    return <ViewSpacing height={spacing.margin.large} />;
  };

  const renderEmpty = () => {
    if (loading) return <LoadingIndicator style={{ margin: spacing.margin.small }} />;
    return <NoSearchResultsFound />;
  };
  const renderItemSeparator = () => <ViewSpacing height={spacing.margin.large} />;

  return (
    <View style={styles.wrapper}>
      <Header
        removeBorderAndShadow
        title={tagName}
        subTitle={communityName}
      />
      <FilterToolbar groupId={groupId} />
      <FlatList
        data={articles}
        showsVerticalScrollIndicator={false}
        style={styles.listContainer}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={renderItemSeparator}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.2}
        keyExtractor={(item) => `list_articles_by_tag_${item.id}`}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    listContainer: {
      flex: 1,
    },
  });
};

export default TagDetail;
