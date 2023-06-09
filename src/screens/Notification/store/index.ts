import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { createStore, resetStore } from '~/store/utils';
import attach from './actions/attach';
import detach from './actions/detach';
import getNotifications from './actions/getNotifications';
import loadMore from './actions/loadMore';
import markAsRead from './actions/markAsRead';
import markAsReadAll from './actions/markAsReadAll';
import markAsSeenAll from './actions/markAsSeenAll';
import markAsUnRead from './actions/markAsUnRead';
import registerPushToken from './actions/registerPushToken';
import update from './actions/update';
import INotificationsState from './Interface';
import handleNotiBackground from './actions/handleNotiBackground';
import getChangelogNotification from './actions/getChangelogNotification';

const initState: INotificationsState = {
  loading: false,
  unseenNumber: 0,
  notificationList: {},
  tabAll: {
    loading: false,
    data: [],
    isLoadingMore: false,
    noMoreData: false,
  },
  tabUnread: {
    loading: false,
    data: [],
    isLoadingMore: false,
    noMoreData: false,
  },
  tabMention: {
    loading: false,
    data: [],
    isLoadingMore: false,
    noMoreData: false,
  },
  tabImportant: {
    loading: false,
    data: [],
    isLoadingMore: false,
    noMoreData: false,
  },
};

const notificationStore = (set, get) => ({
  ...initState,
  pushToken: get()?.pushToken || '',

  actions: {
    getTabData: getNotifications(set, get),
    loadMore: loadMore(set, get),
    markAsRead: markAsRead(set, get),
    markAsReadAll: markAsReadAll(set, get),
    markAsSeenAll: markAsSeenAll(set, get),
    markAsUnRead: markAsUnRead(set, get),
    getChangelogNotification: getChangelogNotification(set, get),

    attach: attach(set, get),
    update: update(set, get),
    detach: detach(set, get),

    savePushToken: (token: string) => {
      set((state: INotificationsState) => {
        state.pushToken = token;
      }, 'setPushToken');
    },
    registerPushToken: registerPushToken(set, get),
    handleNotiBackground: handleNotiBackground(set, get),
    resetChangelogNoti: () => {
      set((state: INotificationsState) => {
        state.changelogsInfoLoading = true;
        state.changelogsInfo = { title: '', content: '' };
      }, 'resetChangelogNoti');
    },
  },

  reset: () => resetStore(initState, set),
});

const useNotificationStore = createStore<INotificationsState>(notificationStore,
  {
    persist: {
      name: 'NotiStorage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ pushToken: state.pushToken }),
    },
  });

export default useNotificationStore;
