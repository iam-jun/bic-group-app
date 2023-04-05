import streamApi from '~/api/StreamApi';
import { IPinContentState, PinAudiences } from '..';

const getPinnableAudiences = (set, _get) => async (postId: string) => {
  try {
    set((state: IPinContentState) => {
      state.isLoadingPinnableAudiences = true;
    });

    const res = await streamApi.getPinnableAudiences(postId);

    if (!res || !res.data) {
      throw new Error('getPinnableAudiences failed');
    }

    const { data } = res;
    const { groups } = data;

    const pinAudiences = groups.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: {
          group: cur,
          error: '',
        },
      }),
      {} as PinAudiences,
    );

    set((state: IPinContentState) => {
      state.isLoadingPinnableAudiences = false;
      state.pinAudiences = pinAudiences;
      state.prevAudiences = groups;
    }, 'getPinnableAudiences success');
  } catch (e) {
    console.error('\x1b[35m🐣️ getPinnableAudiences error: ', e, '\x1b[0m');
    set((state: IPinContentState) => {
      state.isLoadingPinnableAudiences = false;
    });
  }
};

export default getPinnableAudiences;
