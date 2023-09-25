import React, {
  useRef, useEffect, useCallback, useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import { IRouteParams } from '~/interfaces/IRouter';
import Header from '~/beinComponents/Header';
import ArticleWebview, { ArticleWebviewRef } from '~/components/articles/ArticleWebview';
import { BoxScheduleTime } from '~/components/ScheduleContent';
import postsSelector from '~/store/entities/posts/selectors';
import usePostsStore from '~/store/entities/posts';
import useArticlesStore from '../ArticleDetail/store';
import { parseSafe } from '~/utils/common';
import { handleMessage } from '../ArticleContentDetail/helper';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';
import useMounted from '~/hooks/mounted';
import useArticleScheduleMenu from '~/hooks/useArticleScheduleMenu';
import useCreateArticle from '../CreateArticle/hooks/useCreateArticle';
import { useUserIdAuth } from '~/hooks/auth';
import { useBaseHook } from '~/hooks';
import useDraftArticleStore from '~/screens/YourContent/components/Draft/DraftArticle/store';
import spacing from '~/theme/spacing';
import useCreateArticleStore from '../CreateArticle/store';
import PlaceHolderRemoveContent from '~/baseComponents/PlaceHolderRemoveContent';
import { useRootNavigation } from '~/hooks/navigation';

const ArticleReviewSchedule: React.FC<IRouteParams> = (props) => {
  const { articleId, isAdmin } = props?.route?.params || {};
  const ref = useRef<ArticleWebviewRef>();
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;

  const [galleryVisible, setGalleryVisible] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [initIndex, setInitIndex] = useState(0);
  const [isLoadDone, setIsLoadDone] = useState(false);

  const userId = useUserIdAuth();
  const actions = useArticlesStore((state) => state.actions);
  const data = usePostsStore(useCallback(postsSelector.getPost(articleId, {}), [articleId]));
  const {
    content,
    title,
    summary,
    coverMedia,
    createdAt,
    audience,
    series,
    categories,
    actor,
    tags,
    scheduledAt,
    status,
    deleted,
  } = data;
  const isPublishing = useDraftArticleStore((state) => state.isPublishing);
  const { handlePublish } = useCreateArticle({ articleId });
  const resetEditArticleStore = useCreateArticleStore((state) => state.reset);

  const { rootNavigation } = useRootNavigation();

  // for waiting schedule article use createdAt
  const initScript = {
    type: 'initView',
    payload: {
      title,
      summary,
      coverUrl: coverMedia?.url,
      time: createdAt,
      audience,
      series,
      categories,
      contentState: parseSafe(content),
      actor,
      tags,
    },
  };

  const isMounted = useMounted(() => actions.getArticleDetail({ articleId, isAdmin }));
  const isCreator = actor?.id === userId;

  useEffect(() => {
    if (isMounted) injectJavaScript(initScript);
  }, [series, content, isMounted]);

  useEffect(() => {
    if (content) {
      getImageUrls();
    }
  }, [content]);

  useEffect(
    () => resetEditArticleStore,
    [],
  );

  const injectJavaScript = (script: any) => {
    ref?.current?.injectJavaScript?.(script);
  };

  const onInitializeEnd = () => {
    setIsLoadDone(true);
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
      const { url } = item;

      if (!url) return;

      const paths = url.split('/');

      result.push({
        uri: url,
        id: paths[paths.length - 1],
      });
    });

    setListImage(result);
  };

  const onMessage = (message: any) => {
    handleMessage({
      message, listImage, setInitIndex, setGalleryVisible,
    });
  };

  const onPressPublish = () => {
    handlePublish();
  };

  const btnPublish = {
    buttonProps: { loading: isPublishing, style: styles.btnPublish },
    buttonText: t('common:btn_publish'),
    onPressButton: onPressPublish,
  };

  const headerButton = {
    ...btnPublish,
  };

  const { showMenu } = useArticleScheduleMenu(data, isCreator);

  const handleBack = () => {
    rootNavigation.goBack();
  };

  const renderBoxScheduleTime = () => {
    if (!isLoadDone || !scheduledAt) return null;

    return (
      <BoxScheduleTime
        scheduledAt={scheduledAt}
        status={status}
        isBorderTop
        isMarginBottom
      />
    );
  };

  const renderHeader = () => {
    if (isAdmin) {
      return (
        <Header
          titleTextProps={{ useI18n: true }}
          title="article:article_scheduled"
          removeBorderAndShadow
        />
      );
    }
    return (
      <Header
        titleTextProps={{ useI18n: true }}
        title="article:article_scheduled"
        removeBorderAndShadow
        rightIcon="menu"
        onRightPress={showMenu}
        {...headerButton}
      />
    );
  };

  if (deleted) {
    return (
      <ScreenWrapper
        style={styles.container}
        testID="article_review_schedule"
      >
        <Header onPressBack={handleBack} />
        <PlaceHolderRemoveContent label="article:text_delete_article_success" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      style={styles.container}
      testID="article_review_schedule"
      backgroundColor={colors.neutral5}
    >
      {renderHeader()}
      {renderBoxScheduleTime()}
      <ArticleWebview
        ref={ref}
        initScript={initScript}
        onMessage={onMessage}
        onInitializeEnd={onInitializeEnd}
      />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnPublish: {
    marginRight: spacing.margin.small,
  },
});

export default ArticleReviewSchedule;
