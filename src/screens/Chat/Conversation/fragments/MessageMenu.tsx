import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';

interface Props {
  onReactPress: (event: any) => void;
  onReplyPress: (event: any) => void;
  onMenuPress: (event: any) => void;
}

const MessageMenu = ({onReactPress, onReplyPress, onMenuPress}: Props) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Icon
        icon="iconReact"
        tintColor={colors.textSecondary}
        style={styles.icon}
        onPress={onReactPress}
      />
      <Icon
        icon="iconReply"
        tintColor={colors.textSecondary}
        style={styles.icon}
        onPress={onReplyPress}
      />
      <Icon
        icon="iconSettings"
        tintColor={colors.textSecondary}
        style={styles.icon}
        onPress={onMenuPress}
      />
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.base,
      borderColor: colors.placeholder,
      borderWidth: 1,
      padding: spacing.padding.small,
      position: 'absolute',
      top: -16,
      right: 0,
    },
    icon: {
      marginRight: spacing.margin.small,
    },
  });
};

export default MessageMenu;
