import streamApi from '~/api/StreamApi';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import { IPayloadAddToAllPost, PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import useHomeStore from '~/screens/Home/store';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';

const unsavePost = (_set, _get) => async (id: string, type: PostType) => {
  try {
    await streamApi.postUnsavePost(id);
    const post = usePostsStore.getState()?.posts?.[id] || {};
    const newPost = {
      ...post,
      isSaved: false,
    };
    usePostsStore.getState().actions.addToPosts({ data: newPost } as IPayloadAddToAllPost);
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

    Store.store.dispatch(modalActions.showHideToastMessage({ content: `${type.toLowerCase()}:text_unsaved` }));
  } catch (error) {
    console.error('unsavePost error:', error);
    Store.store.dispatch(modalActions.showHideToastMessage({ content: 'common:text_unsave_fail' }));
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
