import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useCallback, useEffect, useRef,
} from 'react';
import { StyleSheet } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { ArticleFooter } from '~/components/articles';
import ArticleWebview, { ArticleWebviewRef } from '~/components/articles/ArticleWebview';
import useMounted from '~/hooks/mounted';
import { useRootNavigation } from '~/hooks/navigation';
import { IMentionUser } from '~/interfaces/IPost';
import { IRouteParams } from '~/interfaces/IRouter';
import mainStack from '~/router/navigator/MainStack/stack';
import topicStack from '~/router/navigator/MainStack/stacks/topic/stack';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { parseSafe } from '~/utils/common';
import useArticlesStore from '../ArticleDetail/store';

export enum EventType {
    ON_PRESS_ACTOR = 'onPressActor',
    ON_PRESS_MENTION = 'onPressMention',
    ON_PRESS_SERIES = 'onPressSeries',
    ON_PRESS_AUDIENCE = 'onPressAudience',
    ON_PRESS_TOPIC = 'onPressTopic'
}

const HEADER_HEIGHT = 244;

const ArticleContentDetail: FC<IRouteParams> = (props) => {
  const id = props?.route?.params?.articleId;
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  const ref = useRef<ArticleWebviewRef>();
  const headerRef = useRef<any>();

  const data = usePostsStore(useCallback(postsSelector.getPost(id, {}), [id]));
  const actions = useArticlesStore((state) => state.actions);

  const {
    content, title, summary, coverMedia, createdAt, audience,
    series, categories, actor, setting, reactionsCount, commentsCount, ownerReactions,
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
    },
  };

  const isMounted = useMounted(() => actions.getArticleDetail(id));

  /**
   * API feed does not return series, so must await
   * getArticleDetail response then init webview again
   */
  useEffect(() => {
    // reload webview after content change
    if (isMounted) injectJavaScript(initScript);
  }, [series, content, isMounted]);

  const onScroll = (event: {offsetY: number}) => {
    const offsetY = event?.offsetY;

    headerRef?.current?.setScrollY?.(offsetY);
  };

  const injectJavaScript = (script: any) => {
    ref?.current?.injectJavaScript?.(script);
  };

  const onPressAudiences = (payload: any) => {
    if (!payload) return;

    const { id, communityId, isCommunity } = payload || {};
    if (isCommunity && communityId) {
      rootNavigation.navigate(mainStack.communityDetail, { communityId });
    } else {
      rootNavigation.navigate(mainStack.groupDetail, { groupId: id, communityId });
    }
  };

  const onPressSeries = (payload: any) => {
    if (!payload) return;

    rootNavigation.navigate(
      mainStack.seriesDetail, { seriesId: payload.id },
    );
  };

  const onPressTopics = (payload: any) => {
    if (!payload) return;

    rootNavigation.replace(
      topicStack.topicDetail, { topicId: payload?.id },
    );
  };

  const onPressMentionAudience = useRef((payload: IMentionUser) => {
    if (!payload) return;

    rootNavigation.navigate(
      mainStack.userProfile, { userId: payload.id },
    );
  }).current;

  const onMessage = (message: any) => {
    const payload = message?.payload;

    switch (message?.type) {
      case EventType.ON_PRESS_ACTOR:
      case EventType.ON_PRESS_MENTION:
        return onPressMentionAudience(payload);
      case EventType.ON_PRESS_SERIES:
        return onPressSeries(payload);
      case EventType.ON_PRESS_AUDIENCE:
        return onPressAudiences(payload);
      case EventType.ON_PRESS_TOPIC:
        return onPressTopics(payload);
      default:
        return console.warn('Article webview onMessage unhandled', message);
    }
  };

  return (
    <ScreenWrapper testID="article_content_detail" isFullView style={styles.container}>
      <Header
        headerRef={headerRef}
        title={title}
        useAnimationTitle
        headerHeight={HEADER_HEIGHT}
      />
      <ArticleWebview
        ref={ref}
        initScript={initScript}
        onMessage={onMessage}
        onScroll={onScroll}
      />
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
