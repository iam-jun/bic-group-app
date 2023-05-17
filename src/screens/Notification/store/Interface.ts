import { INotiChangeLogsInfo, IParamGetNotifications } from '~/interfaces/INotification';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface INotificationTab {
    loading: boolean,
    data: any[],
    isLoadingMore: boolean,
    noMoreData: boolean,
  }

interface INotificationsState extends IBaseState, IFetchingState{
  pushToken?: string,
  loading?: boolean,
  unseenNumber?: number,
  notificationList: any,
  tabAll?: INotificationTab,
  tabUnread?: INotificationTab,
  tabMention?:INotificationTab,
  tabImportant?: INotificationTab,
  changelogsInfo?: INotiChangeLogsInfo,
  changelogsInfoLoading?: boolean,

  actions?: {
    getTabData?: (payload?: IParamGetNotifications) => void,
    loadMore?:(payload?: IParamGetNotifications)=>void,
    markAsRead?: (notificationId: string)=>void,
    markAsReadAll?: (tabId: string)=>void,
    markAsSeenAll?:()=>void,
    markAsUnRead?:(notificationId:string)=>void;

    attach?: (payload: any)=> void;
    update?: (payload: any)=>void;
    detach?: (payload: any)=>void;

    savePushToken?: (token: string) => void;
    registerPushToken?: (payload?: any) => void;
    handleNotiBackground: (remoteMessage: any) => void;
    getChangelogNotification: (notificationId: string) => void;
    resetChangelogNoti: () => void;
  }

}

export default INotificationsState;
