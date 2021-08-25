import React, {useContext, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useNotifications from '~/hooks/notifications';
import NotificationTopBar from './components/NotificationTopBar';
import NotificationBottomSheet from './components/NotificationBottomSheet';
import {useIsFocused} from '@react-navigation/native';
import notificationsActions from './redux/actions';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';
import {useDispatch} from 'react-redux';

const Notfitication = () => {
  const menuSheetRef = useRef<any>();

  const notificationData = useNotifications();
  const {loadingNotifications, notificationList} = notificationData;

  const _onItemPress = (item?: any) => alert('Notification press');

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();
  useEffect(() => {
    if (isFocused) {
      dispatch(
        notificationsActions.markAsSeenAll({
          streamClient,
          userId: userId.toString(),
        }),
      );
    }
  }, [isFocused]);

  const onPressMenu = () => {
    menuSheetRef.current?.open?.();
  };

  const theme: ITheme = useTheme();
  const styles = themeStyles(theme);
  return (
    <ScreenWrapper testID="NotfiticationScreen" isFullView>
      <View style={styles.screenContainer}>
        <Header>
          <NotificationTopBar onPressMenu={onPressMenu} />
        </Header>
        <ListView
          style={styles.list}
          type="notification"
          loading={loadingNotifications}
          isFullView
          renderItemSeparator={() => <ViewSpacing height={2} />}
          data={notificationList}
          onItemPress={_onItemPress}
        />
        <NotificationBottomSheet modalizeRef={menuSheetRef} />
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;
  return StyleSheet.create({
    screenContainer: {
      paddingTop: insets.top,
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {},
  });
};

export default Notfitication;
