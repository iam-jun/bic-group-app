import React from 'react';
import {StyleSheet} from 'react-native';

import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useNotifications from '~/hooks/notifications';

const Notfitication = () => {
  const notificationData = useNotifications();
  const {loadingNotifications, notificationList} = notificationData;

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
        data={notificationList}
        onItemPress={_onItemPress}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  list: {},
});

export default Notfitication;
