import { ILinkPreviewCreatePost, IPayloadUpdateLinkPreview } from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

export interface ILinkPreviewState extends IBaseState {
  lstLinkPreview: ILinkPreviewCreatePost[];
  lstRemovedLinkPreview: string[];

  actions: {
    updateLinkPreview: (payload?: IPayloadUpdateLinkPreview) => void;
  };
}

const initState: InitStateType<ILinkPreviewState> = {
  lstLinkPreview: [],
  lstRemovedLinkPreview: [],
};

const linkPreviewStore = (set) => ({
  ...initState,

  actions: {
    updateLinkPreview: (payload?: IPayloadUpdateLinkPreview) => {
      const { lstLinkPreview, lstRemovedLinkPreview } = payload || {};
      set((state: ILinkPreviewState) => {
        state.lstLinkPreview = lstLinkPreview || initState.lstLinkPreview;
        state.lstRemovedLinkPreview = lstRemovedLinkPreview || initState.lstRemovedLinkPreview;
      }, 'updateLinkPreview');
    },
  },

  reset: () => resetStore(initState, set),
});

const useLinkPreviewStore = createStore<ILinkPreviewState>(linkPreviewStore);

export default useLinkPreviewStore;
