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

export interface NotificationOptionBottomSheetProps {
  modalizeRef: any;
  data: any;
  flag: string;
}

const NotificationOptionBottomSheet: FC<NotificationOptionBottomSheetProps> = ({
  modalizeRef,
  data,
  flag,
}: NotificationOptionBottomSheetProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const dispatch = useDispatch();

  const handleMarkNotification = () => {
    if (!data?.isRead) {
      dispatch(notificationsActions.markAsRead({id: data?.id || '', flag}));
    } else {
      dispatch(notificationsActions.markAsUnRead(data?.id || ''));
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

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.tiny,
    },
    item: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default NotificationOptionBottomSheet;
