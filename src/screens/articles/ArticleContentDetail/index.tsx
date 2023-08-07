import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { ArticleFooter } from '~/components/articles';
import ArticleWebview, {
  ArticleWebviewRef,
} from '~/components/articles/ArticleWebview';
import ContentUnavailable from '~/components/ContentUnavailable';
import ContentNoPermission from '~/components/ContentNoPermission';
import BannerReport from '~/components/Report/BannerReport';
import useMounted from '~/hooks/mounted';
import { IRouteParams } from '~/interfaces/IRouter';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { parseSafe } from '~/utils/common';
import useArticlesStore, { IArticlesState } from '../ArticleDetail/store';
import { getListImage, handleMessage } from './helper';
import APIErrorCode from '~/constants/apiErrorCode';
import useRelatedContentsInSeriesStore from '~/components/RelatedContentsInSeries/store';

const HEADER_HEIGHT = 244;

const ArticleContentDetail: FC<IRouteParams> = (props) => {
  const {
    articleId: id,
    is_reported: isReported,
    noti_id: notiId,
  } = props?.route?.params || {};
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  const ref = useRef<ArticleWebviewRef>();
  const headerRef = useRef<any>();

  // Not use useCallback because id change before get new content => data is outdated
  const data = usePostsStore(postsSelector.getPost(id, {}));
  const errorContent = usePostsStore(postsSelector.getErrorContent(id));
  const { actions } = useArticlesStore((state: IArticlesState) => state);

  const relatedContentsInSeries = useRelatedContentsInSeriesStore((state) => state.data);
  const relatedContentsInSeriesStoreActions = useRelatedContentsInSeriesStore((state) => state.actions);
  const resetRelatedContentsInSeriesStore = useRelatedContentsInSeriesStore((state) => state.reset);

  const [galleryVisible, setGalleryVisible] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [initIndex, setInitIndex] = useState(0);

  const {
    content, title, summary, coverMedia, publishedAt, audience, wordCount,
    series, categories, actor, setting, reactionsCount, commentsCount, ownerReactions, tags,
  } = data;

  const { isError, code } = errorContent || {};

  const seriesIds = series?.map((item) => item.id) || [];

  // for publish article use publishedAt
  const initScript = {
    type: 'initView',
    payload: {
      id,
      title,
      summary,
      coverUrl: coverMedia?.url,
      time: publishedAt,
      audience,
      series,
      categories,
      contentState: parseSafe(content),
      actor,
      tags,
      seriesWithItems: relatedContentsInSeries,
      wordCount,
    },
  };

  const isMounted = useMounted(() => actions.getArticleDetail({ articleId: id, isReported }));

  /**
   * In case navigate to article content detail when it already in stack, we should get data and inject to webview again
   * E.g: Newsfeed => Article detail => Article content detail => Series detail
   * => press article item, navigate to article detail
   */
  useEffect(() => {
    if (isMounted && id) {
      actions.getArticleDetail({ articleId: id, isReported });
    }
  }, [id]);

  useEffect(() => {
    if (series && seriesIds.length > 0) {
      relatedContentsInSeriesStoreActions.getContentsInSeries(seriesIds);
    }
    return resetRelatedContentsInSeriesStore;
  }, [series]);

  /**
   * API feed does not return series, so must await
   * getArticleDetail response then init webview again
   */
  useEffect(() => {
    if (isMounted) injectJavaScript(initScript);
  }, [series, isMounted, relatedContentsInSeries]);

  /**
   * Webview init content only one time, if we want update new content, we must set null for web init again
   */
  useEffect(() => {
    // reload webview after content change
    if (isMounted) {
      const emptyContentScript = {
        ...initScript,
        payload: {
          ...initScript.payload,
          contentState: null,
        },
      };
      injectJavaScript(emptyContentScript);
      injectJavaScript(initScript);
    }
    if (content) {
      getImageUrls();
    }
  }, [content]);

  const onScroll = (event: { offsetY: number }) => {
    const offsetY = event?.offsetY;

    headerRef?.current?.setScrollY?.(offsetY);
  };

  const injectJavaScript = (script: any) => {
    ref?.current?.injectJavaScript?.(script);
  };

  const getImageUrls = () => {
    const contentParse = content ? JSON.parse(content) : [];
    let listImage = [];

    if (contentParse.length > 0) {
      const listImageContent = getListImage({
        type: 'content',
        children: contentParse,
      });
      listImage = [{ ...coverMedia }].concat(listImageContent);
    } else {
      listImage = [{ ...coverMedia }];
    }

    const result = listImage.map((item) => {
      const { url } = item;

      if (!url) return;

      const paths = url.split('/');

      return {
        uri: url,
        id: paths[paths.length - 1],
      };
    });

    setListImage(result);
  };

  const onMessage = (message: any) => {
    handleMessage({
      message, listImage, setInitIndex, setGalleryVisible,
    });
  };

  const renderTitle = () => {
    if (isReported) {
      return t('report:title');
    }
    return '';
  };

  const renderArticleFooter = () => {
    if (isReported) {
      return null;
    }
    return (
      <ArticleFooter
        hideReaction
        reactionToDetail
        articleId={id}
        canReact={setting?.canReact}
        canComment={setting?.canComment}
        commentsCount={commentsCount}
        reactionsCount={reactionsCount}
        ownerReactions={ownerReactions}
      />
    );
  };

  if (
    isError
    && (code === APIErrorCode.Post.CONTENT_GROUP_REQUIRED
      || code === APIErrorCode.Post.ARTICLE_NO_READ_PERMISSION)
  ) {
    return <ContentNoPermission data={errorContent} />;
  }

  if (
    isError
    && (code !== APIErrorCode.Post.CONTENT_GROUP_REQUIRED
      || code !== APIErrorCode.Post.ARTICLE_NO_READ_PERMISSION)
  ) {
    return <ContentUnavailable showButton={!notiId} />;
  }

  return (
    <ScreenWrapper
      testID="article_content_detail"
      isFullView
      style={styles.container}
    >
      <Header
        headerRef={headerRef}
        title={renderTitle()}
        headerHeight={HEADER_HEIGHT}
      />
      <BannerReport postId={id} />
      <ArticleWebview
        ref={ref}
        initScript={initScript}
        onMessage={onMessage}
        onScroll={onScroll}
      />
      {renderArticleFooter()}
      <ImageGalleryModal
        visible={galleryVisible}
        source={listImage}
        initIndex={initIndex}
        onPressClose={() => setGalleryVisible(false)}
        isShowImgName={false}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingBottom: insets.bottom,
    },
  });
};

export default ArticleContentDetail;
