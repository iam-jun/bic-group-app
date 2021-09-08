import React from 'react';
import {StyleSheet, View} from 'react-native';

import Text from '~/beinComponents/Text';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import GroupChatWelcomeImg from '~/../assets/images/group_chat_welcome.svg';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

const GroupChatWelcome = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <SvgIcon
        // @ts-ignore
        source={GroupChatWelcomeImg}
        width={250}
        height={200}
        tintColor="none"
      />
      <View style={styles.textContainer}>
        <Text.Body style={styles.text} useI18n>
          chat:label_init_group_message:full
        </Text.Body>
      </View>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      paddingVertical: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.bgButtonSecondary,
      borderRadius: 100,
    },
    text: {
      color: colors.primary7,
    },
  });
};

export default GroupChatWelcome;
