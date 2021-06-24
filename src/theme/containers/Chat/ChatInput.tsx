import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {
  Composer,
  ComposerProps,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import {useTheme} from 'react-native-paper';
import icons from '~/constants/icons';
import {IObject} from '~/interfaces/common';
import {IMessage} from '~/store/chat/interfaces';
import Icon from '~/theme/components/Icon';
import {spacing} from '~/theme/configs';
import {sizes} from '~/theme/configs/dimension';

export const ChatInput = (
  props: InputToolbarProps & {
    // GiftedChat passes its props to all of its `render*()`
    onEnterPress: (text: string) => void;
    openImagePicker: () => void;
    openFilePicker: () => void;
  },
) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;
  const styles = createStyles(theme);

  return (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      renderActions={() => (
        <View style={styles.actions}>
          <Icon
            fill={colors.grey4}
            isButton
            size={16}
            icon="iconImageMultiple"
            onPress={props.openImagePicker}
          />
          <Icon
            style={styles.icon}
            fill={colors.grey4}
            isButton
            size={16}
            icon="iconAttachment"
            onPress={props.openFilePicker}
          />
        </View>
      )}
      renderComposer={composerProps => (
        <View style={styles.composerWrapper}>
          <Composer
            {...composerProps}
            textInputStyle={styles.composer}
            textInputProps={{
              ...composerProps.textInputProps,
              // for enabling the Return key to send a message only on web
              blurOnSubmit: Platform.OS === 'web',
              onSubmitEditing:
                Platform.OS === 'web'
                  ? event => {
                      if (props.onEnterPress) {
                        props.onEnterPress(event.nativeEvent.text.trim());
                      }
                    }
                  : undefined,
            }}
          />
        </View>
      )}
      renderSend={props => {
        return (
          <Send {...props} containerStyle={styles.iconSend}>
            <Icon
              icon="iconSend"
              isButton
              fill={colors.white}
              backgroundColor={colors.accent}
            />
          </Send>
        );
      }}
    />
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    actions: {
      flexDirection: 'row',
      alignSelf: 'center',
    },
    icon: {
      marginStart: spacing.margin.small,
    },
    inputToolbar: {
      padding: spacing.padding.small,
      justifyContent: 'center',
      backgroundColor: colors.bgColor,
    },
    composerWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: spacing.margin.small,
      borderRadius: spacing.borderRadius.base,
      backgroundColor: colors.background,
    },
    composer: {
      paddingVertical: spacing.padding.small,
      paddingEnd: spacing.padding.small,
      fontSize: sizes.base,
      color: colors.text,
    },
    iconSend: {
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
