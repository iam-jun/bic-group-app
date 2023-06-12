import { resetStore, createStore } from '~/store/utils';

import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { ICommunityBadges, IUserBadge } from '~/interfaces/IEditUser';
import getOwnedBadges from './actions/getOwnedBadges';
import editShowingBadges from './actions/editShowingBadges';
import searchBadges from './actions/searchBadges';

export const MAX_BADGES = 3;

export interface IUserBadgesState extends IBaseState {
  isEditing: boolean;
  loading: boolean;
  loadingEditing: boolean;
  loadingSearch: boolean;
  ownBadges: ICommunityBadges[];
  dataSearch: ICommunityBadges[];
  showingBadges: IUserBadge[];
  choosingBadges: IUserBadge[];
  totalBadges: number;
  error: any;
  actions: {
    setIsEditing: (isEditing: boolean) => void;
    setChoosingBadges: (badges: string[])=> void;
    setShowingBadges: (badges: IUserBadge[], isCurrentUser: boolean) => void;
    fillChoosingBadges: (badge: IUserBadge) => void;
    removeChoosingBadges: (index: number) => void;
    cancleSaveBadges: () => void;
    getOwnedBadges: () => void;
    editShowingBadges: () => void;
    searchBadges: (textSearch: string) => void;
  };
}

const initState: InitStateType<IUserBadgesState> = {
  isEditing: false,
  loading: true,
  loadingEditing: false,
  loadingSearch: false,
  ownBadges: [],
  dataSearch: [],
  showingBadges: [],
  choosingBadges: [undefined, undefined, undefined],
  error: null,
  totalBadges: 0,
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
    setShowingBadges: (badges: IUserBadge[], isCurrentUser: boolean) => {
      if (!isCurrentUser) {
        set((state: IUserBadgesState) => {
          state.showingBadges = badges;
        }, 'setShowingBadgesNotCurrentUser');
        return;
      }
      const choosingBadges = [];
      for (let index = 0; index < MAX_BADGES; index++) {
        if (!badges?.[index]) {
          choosingBadges.push(undefined);
        } else {
          choosingBadges.push(badges[index]);
        }
      }
      set((state: IUserBadgesState) => {
        state.showingBadges = badges;
        state.choosingBadges = choosingBadges;
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
      const { showingBadges, ownBadges } = get();
      const choosingBadges = showingBadges?.length > 0 ? showingBadges : [undefined, undefined, undefined];

      set((state: IUserBadgesState) => {
        state.choosingBadges = choosingBadges;
        state.isEditing = false;
        state.dataSearch = ownBadges;
      }, 'cancleSaveBadges');
    },
    getOwnedBadges: getOwnedBadges(set, get),
    editShowingBadges: editShowingBadges(set, get),
    searchBadges: searchBadges(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useUserBadge = createStore<IUserBadgesState>(userBadge);

export default useUserBadge;
