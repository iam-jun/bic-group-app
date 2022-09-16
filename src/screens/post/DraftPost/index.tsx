import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Tab from '~/baseComponents/Tab';

import Header from '~/beinComponents/Header';
import Image from '~/beinComponents/Image';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useKeySelector } from '~/hooks/selector';
import { IPayloadGetDraftPosts } from '~/interfaces/IPost';
import images from '~/resources/images';
import PostViewDraft from '~/screens/post/components/PostViewDraft';
import modalActions from '~/storeRedux/modal/actions';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import useDraftPostStore from './store';
import { DRAFT_POST_TAB_TYPE } from './store/constants';

const HEADER_TAB = [
  { id: DRAFT_POST_TAB_TYPE.DRAFT_POST, text: 'home:draft_post' },
  { id: DRAFT_POST_TAB_TYPE.DRAFT_ARTICLES, text: 'home:draft_articles_post' },
];

const DraftPost = () => {
  const [lossInternet, setLossInternet] = useState(false);
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();
  const dispatch = useDispatch();

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const {
    posts: draftPosts = [], hasNextPage, refreshing, doGetDraftPosts,
  } = useDraftPostStore();

  useEffect(() => {
    getData(true);
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

  const getData = (isRefreshing?: boolean) => {
    if (userId) {
      const payload: IPayloadGetDraftPosts = {
        isRefresh: isRefreshing,
      };
      doGetDraftPosts(payload);
    }
  };

  const onPressTab = (item: any) => {
    if (item.id === DRAFT_POST_TAB_TYPE.DRAFT_ARTICLES) {
      dispatch(modalActions.showAlertNewFeature());
    } else {
      getData(true);
    }
  };

  const renderItem = ({ item }: any) => <PostViewDraft data={item} />;

  const renderFooter = () => (
    <View>
      {hasNextPage && !refreshing && (
        <View testID="draft_post.load_more_view" style={styles.listFooter}>
          <ActivityIndicator color={theme.colors.gray20} />
        </View>
      )}
      {!refreshing && !hasNextPage && (
        <ViewSpacing height={spacing.margin.large} />
      )}
    </View>
  );

  const renderEmpty = () => (
    <View testID="draft_post.empty_view" style={styles.emptyContainer}>
      <Image source={images.img_empty_draft} style={styles.imgEmpty} />
      <Text.H6 useI18n color={colors.gray50}>
        post:draft:title_no_draft_posts
      </Text.H6>
      <Text useI18n color={colors.gray50}>
        post:draft:text_no_draft_posts
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={t('tabs:menus')} removeBorderAndShadow />
      <View style={styles.tabContainer}>
        <Tab
          style={styles.tabs}
          buttonProps={{ size: 'small', type: 'primary', useI18n: true }}
          data={HEADER_TAB}
          type="pill"
          onPressTab={onPressTab}
        />
      </View>
      <ListView
        isFullView
        containerStyle={styles.listContainer}
        data={draftPosts}
        renderItem={renderItem}
        renderItemSeparator={() => (
          <ViewSpacing height={spacing.margin.large} />
        )}
        ListHeaderComponent={() => <ViewSpacing height={spacing.margin.base} />}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={() => getData(true)}
        onLoadMore={() => getData(false)}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
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
      height: dimension.deviceHeight * 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgEmpty: {
      width: 250,
      height: 200,
    },
    tabContainer: {
      // height: homeHeaderTabHeight,
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      backgroundColor: colors.white,
    },
    tabs: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing.margin.large,
      flexDirection: 'row',
    },
  });
};

export default DraftPost;
