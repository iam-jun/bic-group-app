import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
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

  const options = {
    react: {
      icon: 'iconReact',
      onPress: onReactPress,
    },
    reply: {
      icon: 'iconReplyGrey',
      onPress: onReplyPress,
    },
    settings: {
      icon: 'iconSettings',
      onPress: onMenuPress,
    },
  };

  const renderOption = (option: any) => {
    return (
      <ButtonWrapper onPress={option.onPress} style={styles.option}>
        <Icon icon={option.icon} tintColor={colors.textSecondary} size={16} />
      </ButtonWrapper>
    );
  };

  return (
    <Div className="chat-message-menu">
      <View style={styles.container}>
        {Object.values(options).map(option => renderOption(option))}
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
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.placeholder,
      borderWidth: 1,
      position: 'absolute',
      top: -16,
      right: 0,
    },
    option: {
      width: 24,
      height: 24,
      alignContent: 'center',
      justifyContent: 'center',
    },
  });
};

export default MessageMenu;
