import { createStore, resetStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';
import getSeperateNotificationSettings from './actions/getSpecificNotificationSettings';
import editNotificationSettings from './actions/editSpecificNotificationSettings';
import useNotificationStore from '~/screens/Notification/store';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import { InvitationTargetType, SpecificNotificationType } from '~/interfaces/INotification';
import { ContentType } from '~/components/SelectAudience';

export interface INotificationItemMenuStore extends IBaseState {
  selectedNotificationId: string;
  loading: boolean;
  enableNotificationSettings: boolean;
  targetId: string;
  targetType: SpecificNotificationType;
  isRead: boolean;
  notificationType: string;

  actions: {
    setSelectedNotificationId: (id: string) => void;
    setLoading: (loading: boolean) => void;
    getSeperateNotificationSettings: (targetId: string) => void;
    editNotificationSettings: (targetId: string, enable: boolean) => void;
  }
}

const initialState = {
  selectedNotificationId: '',
  loading: true,
  enableNotificationSettings: true,
  targetId: '',
  targetType: SpecificNotificationType.post,
  isRead: false,
  notificationType: '',
};

const notificationItemMenu = (set, get) => ({
  ...initialState,

  actions: {
    setSelectedNotificationId: (id: string) => {
      const itemValue = useNotificationStore.getState().notificationList?.[id] || {};
      let newTargetId = '';
      let newTargetType = SpecificNotificationType.post;

      const type = itemValue?.extra?.type || undefined;
      const act = itemValue?.activities?.[0] || {};
      const isRead = itemValue?.isRead || false;

      if (type === NOTIFICATION_TYPE.GROUP_INVITATION) {
        const invitationData = act?.invitation?.target || {};
        const communityId = invitationData?.communityId || '';
        const groupId = invitationData?.id || '';
        const targetType = invitationData?.type || '';
        if (targetType === InvitationTargetType.COMMUNITY && !!communityId) {
          newTargetId = communityId;
          newTargetType = SpecificNotificationType.group;
        }
        if (targetType === InvitationTargetType.GROUP && !!groupId) {
          newTargetId = groupId;
          newTargetType = SpecificNotificationType.group;
        }
      } else {
        const contentType = act?.contentType?.toLowerCase?.() || '';
        const contentId = act?.id || '';
        if (contentType === ContentType.POST && !!contentId) {
          newTargetId = contentId;
          newTargetType = SpecificNotificationType.post;
        } if (contentType === ContentType.ARTICLE && !!contentId) {
          newTargetId = contentId;
          newTargetType = SpecificNotificationType.article;
        }
      }
      set((state: INotificationItemMenuStore) => {
        state.selectedNotificationId = id;
        state.targetId = newTargetId;
        state.targetType = newTargetType;
        state.isRead = isRead;
        state.notificationType = type;
      }, 'setSelectedNotificationId');

      get().actions.getSeperateNotificationSettings(newTargetId);
    },
    setLoading: (loading: boolean) => {
      set((state: INotificationItemMenuStore) => {
        state.loading = loading;
      }, 'setLoading');
    },

    getSeperateNotificationSettings: getSeperateNotificationSettings(set, get),
    editNotificationSettings: editNotificationSettings(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useNotificationItemMenu = createStore<INotificationItemMenuStore>(notificationItemMenu);

export default useNotificationItemMenu;
