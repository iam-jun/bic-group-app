import { HOME_TAB_TYPE } from '~/screens/Home/constants';
import IHomeState from '~/storeInterfaces/IHomeState';
import { createZustand } from '~/store/utils';

const homeStore = (set) => ({
  activeTab: HOME_TAB_TYPE.NEWSFEED,

  setActiveTab: (tab: keyof typeof HOME_TAB_TYPE) => {
    set(
      (state: IHomeState) => {
        state.activeTab = tab
      },
      false,
      'setActiveTab',
    )
  },
})

const useHomeStore = createZustand<IHomeState>('home-store', homeStore);

export default useHomeStore
