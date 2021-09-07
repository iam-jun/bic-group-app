import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';

interface Props {
  onReactPress: () => void;
  onReplyPress: () => void;
  onMenuPress: (e: any) => void;
}

const MessageMenu = ({onReactPress, onReplyPress, onMenuPress}: Props) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Icon
        icon="iconReact"
        tintColor={colors.textSecondary}
        style={styles.icon}
        onPress={onReactPress}
      />
      <Icon
        icon="CornerDownRight"
        tintColor={colors.textSecondary}
        style={styles.icon}
        onPress={onReplyPress}
      />
      <Icon
        icon="EllipsisH"
        tintColor={colors.textSecondary}
        style={styles.icon}
        onPress={onMenuPress}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      position: 'absolute',
      top: -16,
      right: 0,
      flexDirection: 'row',
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.borderCard,
      borderWidth: 1,
      padding: spacing.padding.tiny,
    },
    icon: {
      marginRight: spacing.margin.small,
    },
  });
};

export default MessageMenu;
