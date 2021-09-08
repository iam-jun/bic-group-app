import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Div from '~/beinComponents/Div';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';

interface Props {
  onReactPress: (event: any) => void;
  onReplyPress: (event: any) => void;
  onMenuPress: (event: any) => void;
}

const MessageMenu = ({onReactPress, onReplyPress, onMenuPress}: Props) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  if (Platform.OS !== 'web') return null;

  return (
    <Div className="chat-message-menu">
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
          icon="iconSettings"
          tintColor={colors.textSecondary}
          style={styles.icon}
          onPress={onMenuPress}
        />
      </View>
    </Div>
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
