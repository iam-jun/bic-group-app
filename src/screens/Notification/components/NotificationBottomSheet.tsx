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

export interface NotificationBottomSheetProps {
  modalizeRef: any;
  flag: string;
}

const NotificationBottomSheet: FC<NotificationBottomSheetProps> = ({
  modalizeRef,
  flag,
}: NotificationBottomSheetProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const dispatch = useDispatch();

  const markReadAllNotifications = () => {
    dispatch(notificationsActions.markAsReadAll(flag));
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
          testID="notifications.mark_all_as_read"
          style={styles.item}
          leftIcon={'CommentAltCheck'}
          leftIconProps={{icon: 'CommentAltCheck', size: 24}}
          title={i18n.t('notification:mark_all_as_read')}
          onPress={markReadAllNotifications}
        />
        <PrimaryItem
          testID="notifications.notification_settings"
          style={styles.item}
          leftIcon={'gear'}
          leftIconProps={{icon: 'gear', size: 24}}
          title={i18n.t('notification:notification_settings')}
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

export default NotificationBottomSheet;
