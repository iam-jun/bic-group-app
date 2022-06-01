const notificationSelector = {
  isLoading: (type: string) => `notifications.notificationList.${type}.loading`,
  notifications: 'notifications.notificationList',
  notificationByType: (type: string) =>
    `notifications.notificationList.${type}.data`,
  noMoreNotification: (type: string) =>
    `notifications.notificationList.${type}.noMoreData`,
  isLoadingMore: (type: string) =>
    `notifications.notificationList.${type}.isLoadingMore`,
  showMarkedAsReadToast: 'notifications.showMarkedAsReadToast',
};

export default notificationSelector;
