import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';

import Icon from '~/theme/components/Icon';
import {spacing} from '~/theme/configs';
import {margin} from '~/theme/configs/spacing';
import ThemeView from '../ThemeView';
import {IObject} from '~/interfaces/common';

const openImagePicker = () => {
  launchImageLibrary({mediaType: 'photo'}, async ({uri, fileName, type}) => {});
};

const openFilePicker = () => {};

export interface Props {
  commentFocus?: boolean;
  onSend?: (content: string) => void;
  inputRef?: React.Ref<TextInput>;
}

const InputToolbar: React.FC<Props> = ({commentFocus, onSend, inputRef}) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);

  const [comment, setComment] = useState<string>('');

  const _onSend = () => {
    onSend && onSend(comment);
    setComment('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
      style={styles.container}>
      <ThemeView style={styles.inputContainer}>
        <TouchableOpacity onPress={openImagePicker}>
          <Icon
            style={[styles.icon, {marginVertical: margin.tiny}]}
            size={25}
            icon="iconCamera"
          />
        </TouchableOpacity>

        <View style={styles.textbox}>
          <TextInput
            ref={inputRef}
            autoFocus={commentFocus}
            style={styles.textinput}
            placeholder="Write a comment..."
            placeholderTextColor={theme.colors.text}
            multiline
            value={comment}
            onChangeText={comment => setComment(comment)}
          />
          <TouchableOpacity onPress={openFilePicker}>
            <Icon style={styles.icon} size={25} icon="iconAttachment" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon style={styles.icon} size={21} icon="iconEmoji" />
          </TouchableOpacity>
        </View>

        {!!comment && (
          <TouchableOpacity onPress={_onSend}>
            <Icon
              style={[styles.icon, {marginVertical: margin.tiny}]}
              size={25}
              icon="iconSend"
            />
          </TouchableOpacity>
        )}
      </ThemeView>
    </KeyboardAvoidingView>
  );
};

export default React.forwardRef((props: Props, ref?: React.Ref<TextInput>) => (
  <InputToolbar inputRef={ref} {...props} />
));

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 2,
      alignItems: 'flex-end',
      flex: 1,
    },
    inputContainer: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 6,
      paddingVertical: 10,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowColor: '#000000',
      elevation: 4,
    },
    icon: {
      marginHorizontal: spacing.margin.tiny,
    },
    textbox: {
      backgroundColor: colors.background,
      marginHorizontal: margin.base,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    textinput: {
      marginHorizontal: margin.base,
      alignItems: 'center',
      flex: 1,
      color: colors.text,
    },
  });
};
