import streamApi from '~/api/StreamApi';
import { PostType } from '~/interfaces/IPost';
import useMenuStore from '~/store/entities/menus';
import useHomeStore from '~/screens/Home/store';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const unsavePost = (_set, _get) => async (id: string, type: PostType) => {
  try {
    const repsonse = await streamApi.postUnsaveContent(id);

    const menu = useMenuStore.getState().menus?.[id]?.data || {};
    const newMenu = {
      ...menu,
      isSave: false,
    };
    useMenuStore.getState().actions.addOrUpdateMenus(id, newMenu);

    switch (type) {
      case PostType.ARTICLE:
        updateDataFeedSaved(id, ContentFeed.ALL);
        updateDataFeedSaved(id, ContentFeed.ARTICLE);
        break;

      case PostType.SERIES:
        updateDataFeedSaved(id, ContentFeed.ALL);
        updateDataFeedSaved(id, ContentFeed.SERIES);
        break;

      default:
        updateDataFeedSaved(id, ContentFeed.ALL);
        updateDataFeedSaved(id, ContentFeed.POST);
        break;
    }

    showToastSuccess(repsonse);
  } catch (error) {
    console.error('unsavePost error:', error);
    showToastError(error);
  }
};

const updateDataFeedSaved = (id: string, contentFilter: ContentFeed) => {
  const feed = useHomeStore.getState().feed[contentFilter][AttributeFeed.SAVED];
  const homePosts = feed.data || [];
  if (homePosts.length < 1) return;
  const filterPosts = homePosts.filter((item) => item !== id);

  useHomeStore
    .getState()
    .actions.setDataFeed(
      { ...feed, data: filterPosts },
      contentFilter,
      AttributeFeed.SAVED,
    );
};

export default unsavePost;
