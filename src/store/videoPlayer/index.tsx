import {
  createStore, resetStore,
} from '~/store/utils';
import IBaseState from '../interfaces/IBaseState';

export interface IModalVideo {src: string, thumbnail: string}

export interface IVideoPlayerState extends IBaseState {
    isVisible: boolean,
    video: IModalVideo,
    actions:{
      show: (video: IModalVideo) => void;
      hide: () => void;
    }
}

const initialState = {
  isVisible: false,
  video: null,
};

const videoPlayerStore = (set, _get) => ({
  ...initialState,
  actions: {
    show: (video: any) => {
      set((state) => {
        state.isVisible = true;
        state.video = video;
      });
    },
    hide: () => {
      set((state) => {
        state.isVisible = false;
      });
    },
  },
  reset: () => resetStore(initialState, set),
});

const useVideoPlayerStore = createStore<IVideoPlayerState>(videoPlayerStore);

export default useVideoPlayerStore;
