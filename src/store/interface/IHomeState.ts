import { HOME_TAB_TYPE } from '~/screens/Home/constants';

interface IHomeState {
  activeTab: keyof typeof HOME_TAB_TYPE

  setActiveTab: (tab: keyof typeof HOME_TAB_TYPE) => void;
}

export default IHomeState
