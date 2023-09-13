import { navigateToCommunityDetail, navigateToGroupDetail, withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import mainStack from '~/router/navigator/MainStack/stack';
import topicStack from '~/router/navigator/MainStack/stacks/topic/stack';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';
import { IMentionUser, IPost } from '~/interfaces/IPost';
import { openUrl } from '~/utils/link';
import { goToContentInseries } from '~/components/RelatedContentsInSeries/helper';
import { EventType } from '~/components/articles/ArticleWebview';
import { QuizPost, QuizStatus } from '~/interfaces/IQuiz';
import { onPressTakeQuiz } from '~/components/quiz/TakePartInAQuiz/helper';

const rootNavigation = withNavigation?.(rootNavigationRef);

export const handleMessage = (data: {
  message: any;
  listImage: any[];
  setInitIndex: (value: number) => void;
  setGalleryVisible: (value: boolean) => void;
  id?: string;
}) => {
  const {
    message, listImage, setInitIndex, setGalleryVisible, id,
  } = data;
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
    case EventType.ON_PRESS_TAG:
      return onPressTags(payload);
    case EventType.ON_PRESS_IMAGE:
      return onPressImages({
        payload,
        listImage,
        setInitIndex,
        setGalleryVisible,
      });
    case EventType.ON_PRESS_LINK:
      return onPressLink(payload);
    case EventType.ON_NAVIGATE:
      return onNavigateArticle(payload);
    case EventType.ON_PRESS_QUIZ:
      return onPressQuiz(payload, id);
    default:
      return console.warn('Article webview onMessage unhandled', message);
  }
};

export const onPressAudiences = (payload: any) => {
  if (!payload) return;

  const { id, communityId, isCommunity } = payload || {};
  if (isCommunity && communityId) {
    navigateToCommunityDetail({ communityId });
  } else {
    navigateToGroupDetail({ groupId: id, communityId });
  }
};

export const onPressSeries = (payload: any) => {
  if (!payload) return;

  rootNavigation.navigate(mainStack.seriesDetail, { seriesId: payload.id });
};

export const onPressTopics = (payload: any) => {
  if (!payload) return;

  rootNavigation.replace(topicStack.topicDetail, { topicId: payload?.id });
};

export const onPressTags = (payload: any) => {
  if (!payload) return;

  rootNavigation.navigate(tagsStack.tagDetail, {
    tagData: payload,
  });
};

export const onPressLink = (payload: any) => {
  if (!payload) return;

  openUrl(payload.url);
};

export const onPressImages = (data: {
  payload: any;
  listImage;
  setInitIndex;
  setGalleryVisible;
}) => {
  const {
    payload, listImage, setInitIndex, setGalleryVisible,
  } = data;
  if (!payload) return;

  const indexImage = listImage.findIndex((item: any) => item.uri === payload);
  setInitIndex(indexImage < 0 ? 0 : indexImage);
  setGalleryVisible(true);
};

export const onPressMentionAudience = (payload: IMentionUser) => {
  if (!payload || payload?.isDeactivated) return;

  rootNavigation.navigate(mainStack.userProfile, { userId: payload.id });
};

export const getListImage = (node: any) => {
  // Return early if the node is undefined
  if (!node) return [];
  // Return immediately if the node is an image
  if (node?.type === 'img') {
    return [node];
  }
  // Or else,
  // Recursively search for images in the children array
  if (Array.isArray(node.children)) {
    const result = [];
    node.children.forEach((children: any) => {
      if (children) result.push(...getListImage(children));
    });
    return result.flat();
  }
  // Node is text node, no children, or children is not an array
  return [];
};

const onNavigateArticle = (payload: IPost) => {
  goToContentInseries(payload);
};

const onPressQuiz = (payload: QuizPost, articleId: string) => {
  const { id, status } = payload;
  const canTakeQuiz = status === QuizStatus.PUBLISHED;

  if (!id) return;

  if (canTakeQuiz) {
    onPressTakeQuiz(id, articleId);
  }
};
