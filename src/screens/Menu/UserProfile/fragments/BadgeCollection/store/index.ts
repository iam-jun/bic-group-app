import { resetStore, createStore } from '~/store/utils';

import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { ICommunityBadges, IUserBadge } from '~/interfaces/IEditUser';
import getOwnedBadges from './actions/getOwnedBadges';
import editShowingBadges from './actions/editShowingBadges';

export interface IUserBadgesState extends IBaseState {
  isEditing: boolean;
  loading: boolean;
  loadingEditing: boolean;
  ownBadges: ICommunityBadges[];
  showingBadges: IUserBadge[];
  choosingBadges: IUserBadge[];
  error: any;
  actions: {
    setIsEditing: (isEditing: boolean) => void;
    setChoosingBadges: (badges: string[])=> void;
    setShowingBadges: (badges: IUserBadge[]) => void;
    fillChoosingBadges: (badge: IUserBadge) => void;
    removeChoosingBadges: (index: number) => void;
    cancleSaveBadges: () => void;
    getOwnedBadges: () => void;
    editShowingBadges: () => void;
  };
}

const initState: InitStateType<IUserBadgesState> = {
  isEditing: false,
  loading: true,
  loadingEditing: false,
  ownBadges: [],
  showingBadges: [],
  choosingBadges: [undefined, undefined, undefined],
  error: null,
};

const userBadge = (set, get) => ({
  ...initState,
  languages: [],
  country: [],
  city: [],
  actions: {
    setIsEditing: (isEditing: boolean) => {
      set((state: IUserBadgesState) => {
        state.isEditing = isEditing;
      }, 'setIsEditing');
    },
    setChoosingBadges: (badges: IUserBadge[]) => {
      set((state: IUserBadgesState) => {
        state.choosingBadges = badges;
      }, 'setChoosingBadges');
    },
    setShowingBadges: (badges: IUserBadge[]) => {
      set((state: IUserBadgesState) => {
        state.showingBadges = badges;
      }, 'setShowingBadges');
    },
    fillChoosingBadges: (badge: IUserBadge) => {
      const badges = get().choosingBadges;
      const index = badges.findIndex((b) => !b);
      if (index === -1) return;
      const newBadges = [];
      badges.forEach((item, i) => {
        if (i === index) newBadges.push(badge);
        else newBadges.push(item);
      });

      set((state: IUserBadgesState) => {
        state.choosingBadges = newBadges;
      }, `fillChoosingBadges_index_${index}`);
    },
    removeChoosingBadges: (index: number) => {
      const badges = get().choosingBadges;
      const newBadges = [];
      badges.forEach((item, i) => {
        if (i === index) newBadges.push(undefined);
        else newBadges.push(item);
      });

      set((state: IUserBadgesState) => {
        state.choosingBadges = newBadges;
      }, `removeChoosingBadges_index_${index}`);
    },
    cancleSaveBadges: () => {
      const { showingBadges } = get();
      const choosingBadges = showingBadges?.length > 0 ? showingBadges : [undefined, undefined, undefined];

      set((state: IUserBadgesState) => {
        state.choosingBadges = choosingBadges;
        state.isEditing = false;
      }, 'cancleSaveBadges');
    },
    getOwnedBadges: getOwnedBadges(set, get),
    editShowingBadges: editShowingBadges(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useUserBadge = createStore<IUserBadgesState>(userBadge);

export default useUserBadge;
