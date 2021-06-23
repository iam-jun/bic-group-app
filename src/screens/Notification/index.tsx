import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '~/theme/components';
import ListView from '~/theme/components/List/ListView';
import ThemeView from '~/theme/components/ThemeView';
import {margin} from '~/theme/configs/spacing';
import {dummyNotifications} from './dummy-notifications';

const Notfitication = () => {
  return (
    <ThemeView testID="NotfiticationScreen" isFullView>
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
