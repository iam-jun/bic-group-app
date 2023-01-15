import { EventType, handleMessage, onPressImages } from './helper';

describe('ArticleContentDetail helper', () => {
  const message = {
    payload: {
      id: '1',
      communityId: '2',
      isCommunity: true,
    },
    type: null,
  };
  const listImage = [];
  const setInitIndex = jest.fn();
  const setGalleryVisible = jest.fn();

  it('should navigate to userProfile when onPressMentionAudience', () => {
    const messageClone = { ...message };
    messageClone.type = EventType.ON_PRESS_ACTOR;

    const fn = handleMessage({
      message: messageClone,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn).toBeUndefined();
  });

  it('should navigate to seriesDetail when onPressSeries', () => {
    const messageClone = { ...message };
    messageClone.type = EventType.ON_PRESS_SERIES;

    const fn = handleMessage({
      message: messageClone,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn).toBeUndefined();
  });

  it('should navigate to communityDetail when onPressAudiences', () => {
    const messageClone = { ...message };
    messageClone.type = EventType.ON_PRESS_AUDIENCE;

    const fn = handleMessage({
      message: messageClone,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn).toBeUndefined();
  });

  it('should navigate to groupDetail when onPressAudiences', () => {
    const messageClone = { ...message };
    messageClone.type = EventType.ON_PRESS_AUDIENCE;
    messageClone.payload.communityId = null;
    messageClone.payload.isCommunity = null;

    const fn = handleMessage({
      message: messageClone,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn).toBeUndefined();
  });

  it('should replace is topicDetail when onPressTopics', () => {
    const messageClone = { ...message };
    messageClone.type = EventType.ON_PRESS_TOPIC;

    const fn = handleMessage({
      message: messageClone,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn).toBeUndefined();
  });

  it('should navigate to tagDetail when onPressTags', () => {
    const messageClone = { ...message };
    messageClone.type = EventType.ON_PRESS_TAG;

    const fn = handleMessage({
      message: messageClone,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn).toBeUndefined();
  });

  it('should set state index image when onPressImages', () => {
    const messageClone = { ...message };
    messageClone.type = EventType.ON_PRESS_IMAGE;

    const fn = handleMessage({
      message: messageClone,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn).toBeUndefined();

    const fn2 = onPressImages({
      payload: messageClone.payload,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn2).toBeUndefined();
  });

  it('should default', () => {
    const fn = handleMessage({
      message,
      listImage,
      setInitIndex,
      setGalleryVisible,
    });
    expect(fn).toBeUndefined();
  });
});
