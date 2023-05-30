import { resetStore, createStore } from '~/store/utils';

import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { ICommunityBadges, IUserBadge } from '~/interfaces/IEditUser';
import getOwnedBadges from './actions/getOwnedBadges';
import editShowingBadges from './actions/editShowingBadges';

export interface IUserBadgesState extends IBaseState {
  loading: boolean;
  loadingEditing: boolean;
  ownBadges: ICommunityBadges[];
  showingBadges: IUserBadge[];
  choosingBadges: string[];
  error: any;
  actions: {
    setChoosingBadges: (badges: string[])=> void;
    setShowingBadges: (badges: IUserBadge[]) => void;
    getOwnedBadges: () => void;
    editShowingBadges: () => void;
  };
}

const initState: InitStateType<IUserBadgesState> = {
  loading: true,
  loadingEditing: false,
  ownBadges: [],
  showingBadges: [],
  choosingBadges: [],
  error: null,
};

const userBadge = (set, get) => ({
  ...initState,
  languages: [],
  country: [],
  city: [],
  actions: {
    setChoosingBadges: (badges: string[]) => {
      set((state: IUserBadgesState) => {
        state.choosingBadges = badges;
      }, 'setChoosingBadges');
    },
    setShowingBadges: (badges: IUserBadge[]) => {
      set((state: IUserBadgesState) => {
        state.showingBadges = badges;
      }, 'setShowingBadges');
    },
    getOwnedBadges: getOwnedBadges(set, get),
    editShowingBadges: editShowingBadges(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useUserBadge = createStore<IUserBadgesState>(userBadge);

export default useUserBadge;
