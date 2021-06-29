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
import {colors, spacing} from '~/theme/configs';
import {margin} from '~/theme/configs/spacing';
import ThemeView from '../ThemeView';
import {IObject} from '~/interfaces/common';
import Input from '.';
import PrimaryButton from '../Button/primary';
import HorizontalView from '../Layout/HorizontalView';
import KeyboardSpacer from '../Layout/KeyboardSpacer';
import {useBaseHook} from '~/hooks';

const openImagePicker = () => {
  launchImageLibrary({mediaType: 'photo'}, async ({uri, fileName, type}) => {});
};

const openFilePicker = () => {};

export interface Props {
  onSend?: (content: string) => void;
}

const InputToolbar: React.FC<Props> = ({onSend, ...props}) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const [isInputFocus, setInputFocus] = React.useState(false);
  const {t} = useBaseHook();

  const [comment, setComment] = useState<string>('');

  const _onSend = () => {
    onSend && onSend(comment.trim());
    setComment('');
  };

  const renderActions = () => (
    <HorizontalView style={styles.bottom}>
      <HorizontalView
        style={isInputFocus ? styles.actionsBottom : styles.actions}>
        <Icon style={styles.icon} size={18} icon="iconCameraOutline" />
        <Icon style={styles.icon} size={18} icon="iconAttachment" />
        <Icon style={styles.icon} size={18} icon="iconEmoji" />
      </HorizontalView>
      {isInputFocus && (
        <Icon
          style={styles.icon}
          size={22}
          icon={!comment ? 'iconSendOutline' : 'iconSend'}
          disabled={!comment}
          onPress={_onSend}
        />
      )}
    </HorizontalView>
  );

  return (
    <ThemeView style={styles.wrapper}>
      <HorizontalView style={styles.inputWrapper}>
        {!isInputFocus && !comment && renderActions()}
        <TextInput
          style={styles.textInput}
          placeholder={t('comment:placeholder_comment')}
          multiline
          value={comment}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          onChangeText={comment => setComment(comment)}
        />
      </HorizontalView>
      {(!!isInputFocus || !!comment) && renderActions()}
      {Platform.OS === 'ios' && <KeyboardSpacer />}
    </ThemeView>
  );
};

export default InputToolbar;

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 2,
    },
    wrapper: {
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      elevation: 4,
      paddingHorizontal: margin.base,
      paddingVertical: margin.base,
    },
    inputWrapper: {},
    bottom: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actions: {
      paddingLeft: margin.base,
      paddingTop: margin.small,
    },
    actionsBottom: {
      paddingLeft: margin.large,
      paddingTop: margin.small,
    },
    icon: {
      marginEnd: spacing.margin.base,
    },
    textInput: {
      borderRadius: spacing.borderRadius.large,
      backgroundColor: colors.background,
      color: colors.text,
      padding: spacing.padding.base,
      flex: 1,
      maxHeight: 200,
    },
  });
};
