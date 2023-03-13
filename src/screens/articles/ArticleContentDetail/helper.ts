import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import mainStack from '~/router/navigator/MainStack/stack';
import topicStack from '~/router/navigator/MainStack/stacks/topic/stack';
import useCommunitiesStore from '~/store/entities/communities';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';
import { IMentionUser } from '~/interfaces/IPost';

export enum EventType {
  ON_PRESS_ACTOR = 'onPressActor',
  ON_PRESS_MENTION = 'onPressMention',
  ON_PRESS_SERIES = 'onPressSeries',
  ON_PRESS_AUDIENCE = 'onPressAudience',
  ON_PRESS_TOPIC = 'onPressTopic',
  ON_PRESS_TAG = 'onPressTag',
  ON_PRESS_IMAGE = 'onPressImage',
}

const rootNavigation = withNavigation(rootNavigationRef);

export const handleMessage = (data: {
  message: any;
  listImage: any[];
  setInitIndex: (value: number) => void;
  setGalleryVisible: (value: boolean) => void;
}) => {
  const {
    message, listImage, setInitIndex, setGalleryVisible,
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
        payload, listImage, setInitIndex, setGalleryVisible,
      });
    default:
      return console.warn('Article webview onMessage unhandled', message);
  }
};

export const onPressAudiences = (payload: any) => {
  if (!payload) return;

  const { id, communityId, isCommunity } = payload || {};
  if (isCommunity && communityId) {
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  } else {
    rootNavigation.navigate(mainStack.groupDetail, { groupId: id, communityId });
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

  const communityId = useCommunitiesStore.getState().currentCommunityId;
  rootNavigation.navigate(tagsStack.tagDetail, { tagData: payload, communityId });
};

export const onPressImages = (data: { payload: any; listImage; setInitIndex; setGalleryVisible }) => {
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
