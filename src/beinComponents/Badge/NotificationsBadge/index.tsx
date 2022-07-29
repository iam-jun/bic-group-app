import React from 'react';
import NotificationsBadgeComponent, {
  NotificationsBadgeComponentProps,
} from './NotificationsBadgeComponent';

const Default: React.FC<NotificationsBadgeComponentProps> = (props: NotificationsBadgeComponentProps) => <NotificationsBadgeComponent variant="default" {...props} />;

const Info: React.FC<NotificationsBadgeComponentProps> = (props: NotificationsBadgeComponentProps) => <NotificationsBadgeComponent variant="info" {...props} />;

const Alert: React.FC<NotificationsBadgeComponentProps> = (props: NotificationsBadgeComponentProps) => <NotificationsBadgeComponent variant="alert" {...props} />;

const NotificationsBadge = Object.assign(
  NotificationsBadgeComponent, {
    Default,
    Info,
    Alert,
  },
);

export default NotificationsBadge;
