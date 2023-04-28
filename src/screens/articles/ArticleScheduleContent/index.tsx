import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, RefreshControl, StyleSheet, View,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '~/baseComponents/Text';
import Header from '~/beinComponents/Header';
import Image from '~/components/Image';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { ArticleScheduleItem } from '~/components/articles';
import { IPayloadGetArticleScheduleContent } from '~/interfaces/IArticle';
import { IRouteParams } from '~/interfaces/IRouter';
import images from '~/resources/images';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import { spacing } from '~/theme';
import useArticleScheduleContentStore, { IArticleScheduleContentState } from './store';

const ArticleScheduleContent: FC<IRouteParams> = (props) => {
  const groupId = props?.route?.params?.groupId;
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const [lossInternet, setLossInternet] = useState(false);

  const {
    articles, hasNextPage, refreshing, actions,
  } = useArticleScheduleContentStore(
    (state: IArticleScheduleContentState) => state,
  );

  useEffect(() => {
    getData(true);
    return () => {
      actions.clearArticleScheduleContent();
    };
  }, []);

  useEffect(() => {
    if (isInternetReachable) {
      if (lossInternet) {
        setLossInternet(false);
        getData(false);
      }
    } else {
      setLossInternet(true);
    }
  }, [isInternetReachable]);

  const onLoadMore = () => {
    getData(false);
  };

  const onRefresh = () => {
    getData(true);
  };

  const getData = (isRefreshing?: boolean) => {
    const payload: IPayloadGetArticleScheduleContent = {
      isRefresh: isRefreshing,
      groupId,
    };
    actions.getArticleScheduleContent(payload);
  };

  const renderItem = ({ item }: any) => <ArticleScheduleItem data={item} isAdmin />;

  const renderFooter = () => (
    <View>
      {hasNextPage && !refreshing && (
        <View testID="draft_article.load_more_view" style={styles.listFooter}>
          <ActivityIndicator color={colors.gray20} />
        </View>
      )}
      {!refreshing && !hasNextPage && <ViewSpacing height={spacing.margin.large} />}
    </View>
  );

  const renderEmpty = () => {
    if (articles.length === 0 && refreshing) {
      return null;
    }

    return (
      <View testID="draft_article.empty_view" style={styles.emptyContainer}>
        <Image style={styles.imgEmpty} source={images.img_empty_box} />
        <Text.BodyS useI18n color={colors.neutral40}>
          your_content:text_empty
        </Text.BodyS>
      </View>
    );
  };

  return (
    <ScreenWrapper testID="article_schedule_content" isFullView style={styles.container}>
      <Header title={t('settings:title_schedule_content')} />
      <FlatList
        testID="article_schedule_content.list"
        style={styles.listContainer}
        data={articles}
        renderItem={renderItem}
        ListHeaderComponent={() => <ViewSpacing height={spacing.margin.large} />}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <ViewSpacing height={spacing.margin.large} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gray40} />}
        keyExtractor={(item, index) => `list-article-schedule-content-${item.id}-${index}`}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
      paddingBottom: insets.bottom,
    },
    listContainer: {
      flex: 1,
    },
    listFooter: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      paddingVertical: spacing.padding.extraLarge * 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgEmpty: {
      width: 100,
      height: 84,
      marginBottom: spacing.margin.large,
    },
  });
};

export default ArticleScheduleContent;
