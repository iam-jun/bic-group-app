import React, {useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';

import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {AppContext} from '~/contexts/AppContext';
import notificationsActions from './redux/actions';
import useNotifications from '~/hooks/notifications';

const Notfitication = () => {
  const dispatch = useDispatch();
  const notificationData = useNotifications();
  const {loadingNotifications, notificationList} = notificationData;

  const {streamClient} = useContext(AppContext);

  useEffect(() => {
    // TODO: will need to change userId
    const userId = 0;
    dispatch(
      notificationsActions.getNotifications({
        streamClient,
        userId: userId.toString(),
      }),
    );
  }, []);

  const _onItemPress = (item?: any) => alert('Notification press');

  return (
    <ScreenWrapper testID="NotfiticationScreen" isFullView>
      <Header hideBack title={'Notifications'} />
      <ListView
        style={styles.list}
        type="notification"
        loading={loadingNotifications}
        isFullView
        renderItemSeparator={() => <ViewSpacing height={2} />}
        data={notificationList.results}
        onItemPress={_onItemPress}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  list: {},
});

export default Notfitication;
