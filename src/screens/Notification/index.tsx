import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Container, Text} from '~/theme/components';
import ListView from '~/theme/components/List/ListView';
import ThemeView from '~/theme/components/ThemeView';
import {margin} from '~/theme/configs/spacing';
import {dummyNotifications} from './dummy-notifications';

const Notfitication = () => {
  return (
    <ThemeView testID="NotfiticationScreen" isFullView>
      <Container>
        <ListView
          type="notification"
          data={dummyNotifications}
          ListHeaderComponent={
            <View>
              <Text style={styles.header} h1 bold>
                Notifications
              </Text>
            </View>
          }
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
});

export default Notfitication;
