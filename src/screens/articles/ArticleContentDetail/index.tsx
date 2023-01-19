import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import React, {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { ArticleFooter } from '~/components/articles';
import ArticleWebview, { ArticleWebviewRef } from '~/components/articles/ArticleWebview';
import ContentUnavailable from '~/components/ContentUnavailable';
import BannerReport from '~/components/Report/BannerReport';
import useMounted from '~/hooks/mounted';
import { IRouteParams } from '~/interfaces/IRouter';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { parseSafe } from '~/utils/common';
import useArticlesStore, { IArticlesState } from '../ArticleDetail/store';
import { handleMessage } from './helper';

const HEADER_HEIGHT = 244;

const ArticleContentDetail: FC<IRouteParams> = (props) => {
  const { articleId: id, is_reported: isReported } = props?.route?.params || {};
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  const ref = useRef<ArticleWebviewRef>();
  const headerRef = useRef<any>();

  const data = usePostsStore(useCallback(postsSelector.getPost(id, {}), [id]));
  const { actions, errors } = useArticlesStore((state: IArticlesState) => state);
  const isFetchError = errors[id];

  const [galleryVisible, setGalleryVisible] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [initIndex, setInitIndex] = useState(0);

  const {
    content, title, summary, coverMedia, createdAt, audience,
    series, categories, actor, setting, reactionsCount, commentsCount, ownerReactions, tags,
  } = data;

  const initScript = {
    type: 'initView',
    payload: {
      title,
      summary,
      coverUrl: coverMedia?.url,
      createdAt,
      audience,
      series,
      categories,
      contentState: parseSafe(content),
      actor,
      tags,
    },
  };

  const isMounted = useMounted(() => actions.getArticleDetail({ articleId: id, isReported }));

  /**
   * API feed does not return series, so must await
   * getArticleDetail response then init webview again
   */
  useEffect(() => {
    // reload webview after content change
    if (isMounted) injectJavaScript(initScript);
  }, [series, content, isMounted]);

  useEffect(() => {
    if (content) {
      getImageUrls();
    }
  }, [content]);

  const onScroll = (event: {offsetY: number}) => {
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
      const listImageContent = contentParse?.filter((item: any) => item.type === 'img');
      listImage = [{ ...coverMedia }].concat(listImageContent);
    } else {
      listImage = [{ ...coverMedia }];
    }

    const result: any = [];
    listImage.forEach((item) => {
      result.push({
        uri: item.url,
        name: item?.name || `${item?.id}.png`,
      });
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

  if (isFetchError) {
    return <ContentUnavailable />;
  }

  return (
    <ScreenWrapper testID="article_content_detail" isFullView style={styles.container}>
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
