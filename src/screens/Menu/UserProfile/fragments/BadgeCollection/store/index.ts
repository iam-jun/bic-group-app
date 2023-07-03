import { resetStore, createStore } from '~/store/utils';

import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { ICommunityBadges, IUserBadge } from '~/interfaces/IEditUser';
import getOwnedBadges from './actions/getOwnedBadges';
import editShowingBadges from './actions/editShowingBadges';
import searchBadges from './actions/searchBadges';
import markNewBadge from './actions/markNewBadge';
import markNewBadgeInCommunity from './actions/markNewBadgeInCommunity';

export const MAX_BADGES = 3;

export interface IUserBadgesState extends IBaseState {
  isEditing: boolean;
  loading: boolean;
  loadingEditing: boolean;
  loadingSearch: boolean;
  hasNewBadge: boolean;
  ownBadges: ICommunityBadges[];
  dataSearch: ICommunityBadges[];
  showingBadges: IUserBadge[];
  choosingBadges: IUserBadge[];
  choosingBadgesOrder: number[];
  totalBadges: number;
  badges: {[key: string]: IUserBadge},
  error: any;
  actions: {
    setIsEditing: (isEditing: boolean) => void;
    setChoosingBadges: (badges: string[])=> void;
    setShowingBadges: (badges: IUserBadge[], isCurrentUser: boolean) => void;
    fillChoosingBadges: (badge: IUserBadge) => void;
    removeChoosingBadges: (index: number) => void;
    cancleSaveBadges: () => void;
    reorderChoosingBadgesOrder: (value: number, newIndex: number) => void;
    resetChoosingBadgesOrder: () => void;
    getOwnedBadges: () => void;
    editShowingBadges: () => void;
    searchBadges: (textSearch: string) => void;
    markNewBadge: (id: string) => void;
    markNewBadgeInCommunity: (badges: IUserBadge[]) => void;
  };
}

const initState: InitStateType<IUserBadgesState> = {
  isEditing: false,
  loading: true,
  loadingEditing: false,
  loadingSearch: false,
  hasNewBadge: false,
  ownBadges: [],
  dataSearch: [],
  showingBadges: [],
  choosingBadges: [undefined, undefined, undefined],
  badges: {},
  error: null,
  totalBadges: 0,
  choosingBadgesOrder: [0, 1, 2],
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
      const { choosingBadges, choosingBadgesOrder } = get();
      let needFillOrder = -1;
      for (let index = 0; index < choosingBadgesOrder.length; index++) {
        const order = choosingBadgesOrder[index];
        if (!choosingBadges[order]) {
          needFillOrder = order;
          break;
        }
      }

      if (needFillOrder === -1) return;
      const newBadges = [];
      choosingBadges.forEach((item, i) => {
        if (i === needFillOrder) newBadges.push(badge);
        else newBadges.push(item);
      });

      set((state: IUserBadgesState) => {
        state.choosingBadges = newBadges;
      }, `fillChoosingBadges_index_${needFillOrder}`);
    },
    removeChoosingBadges: (index: number) => {
      const badges = get().choosingBadges;
      const newBadges = [];
      badges.forEach((item, i) => {
        if (i === index) newBadges.push(undefined);
        else newBadges.push(item);
      });

      set((state: IUserBadgesState) => {
        state.choosingBadges = [...newBadges];
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
    reorderChoosingBadgesOrder: (value: number, newIndex: number) => {
      const { choosingBadgesOrder } = get();
      const newBadges = [...choosingBadgesOrder];
      const currentIndex = newBadges.indexOf(value);
      if (currentIndex === -1) return;

      const badge = newBadges.splice(currentIndex, 1);
      newBadges.splice(newIndex, 0, badge[0]);
      set((state: IUserBadgesState) => {
        state.choosingBadgesOrder = newBadges;
      }, 'reorderChoosingBadgesOrder');
    },
    resetChoosingBadgesOrder: () => {
      set((state: IUserBadgesState) => {
        state.choosingBadgesOrder = initState.choosingBadgesOrder;
      }, 'resetChoosingBadgesOrder');
    },
    getOwnedBadges: getOwnedBadges(set, get),
    editShowingBadges: editShowingBadges(set, get),
    searchBadges: searchBadges(set, get),
    markNewBadge: markNewBadge(set, get),
    markNewBadgeInCommunity: markNewBadgeInCommunity(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useUserBadge = createStore<IUserBadgesState>(userBadge);

export default useUserBadge;
