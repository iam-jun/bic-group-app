import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {ITheme} from '~/theme/interfaces';
import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import notificationsActions from '../redux/actions';
import i18n from 'i18next';
import * as modalActions from '~/store/modal/actions';
import spacing from '~/theme/spacing';

export interface NotificationOptionBottomSheetProps {
  modalize: any;
  keyValue: string;
  data: any;
}

const NotificationOptionBottomSheet: FC<NotificationOptionBottomSheetProps> = ({
  modalizeRef,
  data,
  keyValue,
}: NotificationOptionBottomSheetProps) => {
  const theme: ITheme = useTheme() as ITheme;

  const dispatch = useDispatch();

  const handleMarkNotification = () => {
    if (!data?.isRead) {
      dispatch(notificationsActions.markAsRead({id: data?.id || '', keyValue}));
    } else {
      dispatch(notificationsActions.markAsUnRead(data));
    }
    modalizeRef.current?.close();
  };

  const showUpcommingFeature = () => {
    modalizeRef.current?.close();
    dispatch(modalActions.showAlertNewFeature());
  };

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <PrimaryItem
          testID="notification.mark_notification_read_or_unread"
          style={styles.item}
          leftIcon={'CommentAltCheck'}
          leftIconProps={{icon: 'CommentAltCheck', size: 24}}
          title={i18n.t(
            !data?.isRead
              ? 'notification:mark_as_read'
              : 'notification:mark_as_unread',
          )}
          onPress={handleMarkNotification}
        />
        <PrimaryItem
          testID="notification.off_notification_from_group"
          style={styles.item}
          leftIcon={'VolumeMute'}
          leftIconProps={{icon: 'VolumeMute', size: 24}}
          title={i18n.t('notification:off_notification_from_group')}
          onPress={showUpcommingFeature}
        />
      </View>
    );
  };

  return (
    <BottomSheet modalizeRef={modalizeRef} ContentComponent={renderContent()} />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.padding.tiny,
  },
  item: {
    height: 44,
    paddingHorizontal: spacing.padding.large,
  },
});

export default NotificationOptionBottomSheet;
