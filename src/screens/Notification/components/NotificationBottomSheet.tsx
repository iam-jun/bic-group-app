import React, {FC, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {ITheme} from '~/theme/interfaces';
import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import notificationsActions from '../redux/actions';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import i18n from 'i18next';

export interface NotificationBottomSheetProps {
  modalizeRef: any;
}

const NotificationBottomSheet: FC<NotificationBottomSheetProps> = ({
  modalizeRef,
}: NotificationBottomSheetProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const dispatch = useDispatch();
  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();
  const markReadAllNotifications = () => {
    dispatch(
      notificationsActions.markAsReadAll({
        streamClient,
        userId: userId.toString(),
      }),
    );
    modalizeRef.current?.close();
  };
  const renderContent = () => {
    return (
      <View style={styles.container}>
        <PrimaryItem
          style={styles.item}
          leftIcon={'CommentAltCheck'}
          leftIconProps={{icon: 'CommentAltCheck', size: 24}}
          title={i18n.t('notification:mark_all_as_read')}
          onPress={markReadAllNotifications}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'Cog'}
          leftIconProps={{icon: 'Cog', size: 24}}
          title={i18n.t('notification:notification_settings')}
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
      paddingHorizontal: spacing.padding.large,
    },
    item: {height: 44},
  });
};

export default NotificationBottomSheet;
