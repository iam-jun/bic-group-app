import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '~/beinComponents/Text';

const GroupChatWelcome = () => {
  const styles = themeStyles();
  return (
    <View style={styles.container}>
      <Text.Body useI18n>chat:label_init_group_message:full</Text.Body>
    </View>
  );
};

const themeStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
  });
};

export default GroupChatWelcome;
