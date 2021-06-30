import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Container, Header, Text} from '~/theme/components';
import ListView from '~/theme/components/List/ListView';
import ThemeView from '~/theme/components/ThemeView';
import {margin, padding} from '~/theme/configs/spacing';
import {dummyNotifications} from './dummy-notifications';

const Notfitication = () => {
  return (
    <ThemeView testID="NotfiticationScreen" isFullView>
      <Header title="Notification" rightIcon="iconSettings" />

      <Container>
        <ListView
          style={styles.list}
          type="notification"
          data={dummyNotifications}
        />
      </Container>
    </ThemeView>
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
