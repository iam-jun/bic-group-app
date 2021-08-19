import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {
  Composer,
  InputToolbar,
  InputToolbarProps,
  Send,
} from 'react-native-gifted-chat';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import Icon from '~/beinComponents/Icon';
import {letterSpacing, sizes} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {fontFamilies} from '~/theme/fonts';

const ChatInput = (
  props: InputToolbarProps & {
    // GiftedChat passes its props to all of its `render*()`
    onEnterPress: (text: string) => void;
    openImagePicker: () => void;
    openFilePicker: () => void;
  },
) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyles(theme);
  const [actionsVisible, setActionVisible] = useState(true);

  const renderActions = () =>
    actionsVisible ? (
      <View style={styles.actions}>
        <Icon
          size={16}
          iconStyle={styles.icon}
          tintColor={colors.textReversed}
          icon="iconAddImage"
          onPress={props.openImagePicker}
        />
        <ViewSpacing width={spacing.margin.small} />
        <Icon
          size={16}
          iconStyle={styles.icon}
          tintColor={colors.textReversed}
          icon="attachment"
          onPress={props.openFilePicker}
        />
      </View>
    ) : (
      <View style={styles.actions}>
        <Icon
          size={22}
          icon="iconBack"
          onPress={() => setActionVisible(true)}
        />
      </View>
    );

  return (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      renderActions={renderActions}
      renderComposer={composerProps => (
        <View style={styles.composerWrapper}>
          <Composer
            {...composerProps}
            textInputStyle={styles.composer}
            onTextChanged={text => {
              composerProps.onTextChanged && composerProps.onTextChanged(text);
              actionsVisible && setActionVisible(false);
            }}
            textInputProps={{
              ...composerProps.textInputProps,
              placeholder: 'Aa',
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
            <Icon icon="iconSend" size={22} tintColor={colors.accent} />
          </Send>
        );
      }}
    />
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    actions: {
      flexDirection: 'row',
      alignSelf: 'center',
    },
    icon: {
      backgroundColor: colors.primary,
      borderRadius: spacing.borderRadius.small,
      padding: spacing.padding.tiny,
    },
    inputToolbar: {
      paddingHorizontal: spacing.padding.base,
      paddingVertical: spacing.padding.small,
      borderTopColor: 'transparent',
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    composerWrapper: {
      flex: 1,
      flexDirection: 'row',
      marginHorizontal: spacing.margin.small,
      paddingVertical: 2,
      backgroundColor: colors.placeholder,
      borderRadius: spacing.borderRadius.large,
    },
    composer: {
      fontFamily: fontFamilies.Segoe,
      fontSize: sizes.body,
      lineHeight: 16,
      letterSpacing: letterSpacing.body,
      color: colors.textPrimary,
    },
    iconSend: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default ChatInput;
