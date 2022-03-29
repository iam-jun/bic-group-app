import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {getUnreadChannelCount} from '~/selectors/chat';
import {ITheme} from '~/theme/interfaces';
import NotificationsBadge from '../Badge/NotificationsBadge';
import Icon from '../Icon';

interface Props {
  onPress: () => void;
}

const IconChat = ({onPress}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const count = useSelector(state => getUnreadChannelCount(state));

  return (
    <View>
      <Icon
        icon="iconChat"
        size={24}
        style={styles.icon}
        onPress={onPress}
        backgroundColor={theme.colors.bgSecondary}
        buttonTestID="header.iconChat.button"
        testID="header.iconChat"
      />
      <NotificationsBadge.Alert
        style={styles.badge}
        number={count}
        maxNumber={99}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    icon: {
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.padding.small,
      borderRadius: 20,
      marginRight: spacing.margin.tiny,
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  });
};

export default IconChat;
