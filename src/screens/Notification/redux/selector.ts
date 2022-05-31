const notificationSelector = {
  isLoading: 'notifications.loadingNotifications',
  notifications: 'notifications.notificationList',
  notificationByType: (type: string) =>
    `notifications.notificationList.${type}`,
  noMoreNotification: 'notifications.noMoreNotification',
  isLoadingMore: 'notifications.isLoadingMore',
  showMarkedAsReadToast: 'notifications.showMarkedAsReadToast',
};

export default notificationSelector;
