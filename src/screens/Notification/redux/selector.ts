const notificationSelector = {
  isLoading: (type: string) => `notifications.${type}.loading`,
  notifications: 'notifications.notificationList',
  getNotificationById: (id: string) => `notifications.notificationList.${id}`,
  notificationByType: (type: string) => `notifications.${type}.data`,
  noMoreNotification: (type: string) => `notifications.${type}.noMoreData`,
  isLoadingMore: (type: string) => `notifications.${type}.isLoadingMore`,
  showMarkedAsReadToast: 'notifications.showMarkedAsReadToast',
};

export default notificationSelector;
