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
  hideHeader?: boolean;
}

const MessageMenu = ({
  onReactPress,
  onReplyPress,
  onMenuPress,
  hideHeader = true,
}: Props) => {
  if (Platform.OS !== 'web') return null;

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

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

  let className = 'chat-message-menu';
  if (!hideHeader) className = className + ' chat-message-menu--with-header';

  return (
    <Div className={className}>
      <View style={styles.container}>
        {Object.values(options).map(option => {
          return (
            <Div key={option.icon} className="chat-message-menu__option">
              <ButtonWrapper onPress={option.onPress} style={styles.option}>
                <Icon
                  // @ts-ignore
                  icon={option.icon}
                  tintColor={colors.textSecondary}
                  size={16}
                />
              </ButtonWrapper>
            </Div>
          );
        })}
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
