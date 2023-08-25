import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IMenu } from '~/interfaces/IMenu';
import getMenuContent from './actions/getMenuContent';

export interface IMenuState extends IBaseState {
  isLoadingGetMenu: boolean;
  menus: {
    [contentId: string]: IMenu;
  };

  actions: {
    getMenuContent: (contentId: string) => void;
    initMenuContent: (contentId: string) => void;
    addOrUpdateMenus: (contentId: string, menu: IMenu) => void;
  };
}

const initState: InitStateType<IMenuState> = {
  isLoadingGetMenu: true,
  menus: {},
};

const menuStore = (set, get) => ({
  ...initState,

  actions: {
    getMenuContent: getMenuContent(set, get),
    initMenuContent: (contentId: string) => {
      set((state: IMenuState) => {
        state.menus[contentId] = {};
      }, 'initMenuContent');
    },
    addOrUpdateMenus: (contentId: string, menu: IMenu) => {
      set((state: IMenuState) => {
        state.menus[contentId] = menu;
      }, 'addOrUpdateMenus');
    },
  },

  reset: () => resetStore(initState, set),
});

const useMenuStore = createStore<IMenuState>(menuStore);

export default useMenuStore;
