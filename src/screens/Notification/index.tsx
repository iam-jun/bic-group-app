import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Container, NavigationHeader, Text} from '~/components';
import ListView from '~/components/list/ListView';
import ScreenWrapper from '~/components/ScreenWrapper';
import {margin, padding} from '~/theme/spacing';
import {dummyNotifications} from './dummy-notifications';

const Notfitication = () => {
  return (
    <ScreenWrapper testID="NotfiticationScreen" isFullView>
      <NavigationHeader title="Notification" rightIcon="iconSettings" />

      <Container>
        <ListView
          style={styles.list}
          type="notification"
          data={dummyNotifications}
        />
      </Container>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    marginStart: margin.large,
    marginVertical: margin.small,
  },
  list: {
    paddingTop: padding.base,
  },
});

export default Notfitication;
