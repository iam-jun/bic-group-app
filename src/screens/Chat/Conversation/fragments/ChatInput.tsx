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
import {spacing} from '~/theme';
import {sizes} from '~/theme/dimension';

const ChatInput = (
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
  const [actionsVisible, setActionVisible] = useState(true);

  const renderActions = () =>
    actionsVisible ? (
      <View style={styles.actions}>
        <Icon
          tintColor={colors.black}
          isButton
          size={16}
          icon="iconImageMultiple"
          onPress={props.openImagePicker}
        />
        <Icon
          style={styles.icon}
          tintColor={colors.black}
          isButton
          size={16}
          icon="iconAttachment"
          onPress={props.openFilePicker}
        />
      </View>
    ) : (
      <View style={styles.actions}>
        <Icon
          style={styles.icon}
          tintColor={colors.black}
          size={16}
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
            <Icon icon="iconSend" size={20} tintColor={colors.accent} />
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
      marginStart: spacing.margin.base,
    },
    inputToolbar: {
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.bgColor,
      borderTopColor: colors.divider,
    },
    composerWrapper: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: spacing.borderRadius.base,
    },
    composer: {
      fontSize: sizes.base,
      color: colors.text,
    },
    iconSend: {
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      marginStart: spacing.margin.base,
      marginBottom: spacing.margin.base,
    },
  });
};

export default ChatInput;
