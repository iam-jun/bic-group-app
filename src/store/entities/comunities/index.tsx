import { IObject } from '~/interfaces/common';
import { ICommunity } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore, resetStore,
} from '../../utils';
import getCommunity from './actions/getCommunity';

export interface ICommunitiesState extends IBaseState {
    /**
        To handle fetching state.
        For example: loading, refreshings
    * */
    requestings: IObject<boolean>;
    data: IObject<ICommunity>;
    /**
     * Set currentCommunityId when call doGetCommunity
     * The screens in the same stack can access
     * through store (no need to set param when navigating)
     */
    currentCommunityId?: string;
    errors: IObject<any>;
    actions:{
      getCommunity: (id: string) => void;
      updatecommunity: (id: string, payload: ICommunity) => void,
      resetCommunity: (id: string) => void;
    }
}

const initialState = {
  requestings: {},
  data: {},
  errors: {},
};

const communitiesStore = (set, get) => ({
  ...initialState,
  actions: {
    getCommunity: getCommunity(set, get),
    updateCommunity: (communityId:string, payload: ICommunity) => {
      set((state) => {
        state.data[communityId] = { ...state.data[communityId], ...payload };
      }, 'updateCommunity');
    },
    resetCommunity: (id: string) => {
      set((state: ICommunitiesState) => {
        delete state.data[id];
        delete state.errors[id];
      });
    },
  },
  reset: () => resetStore(initialState, set),

});

const useCommunitiesStore = createStore<ICommunitiesState>(communitiesStore);

export default useCommunitiesStore;
