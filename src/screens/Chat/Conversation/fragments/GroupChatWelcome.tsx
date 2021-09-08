import React from 'react';
import {StyleSheet, View} from 'react-native';

import Text from '~/beinComponents/Text';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import GroupChatWelcomeImg from '~/../assets/images/group_chat_welcome.svg';

const GroupChatWelcome = () => {
  const styles = themeStyles();
  return (
    <View style={styles.container}>
      <SvgIcon
        // @ts-ignore
        source={GroupChatWelcomeImg}
        width={250}
        height={200}
        tintColor="none"
      />
      <Text.Body useI18n>chat:label_init_group_message:full</Text.Body>
    </View>
  );
};

const themeStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default GroupChatWelcome;
