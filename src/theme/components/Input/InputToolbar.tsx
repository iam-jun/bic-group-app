import React, {useState, useEffect} from 'react';
import {StyleSheet, Platform, TextInput, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/theme/components/Icon';
import {spacing} from '~/theme/configs';
import {margin} from '~/theme/configs/spacing';
import ThemeView from '../ThemeView';
import {IObject} from '~/interfaces/common';
import HorizontalView from '../Layout/HorizontalView';
import KeyboardSpacer from '../Layout/KeyboardSpacer';
import {useBaseHook} from '~/hooks';
import commonActions from '~/constants/commonActions';
import Text from '~/theme/components/Text';
export interface Props {
  commentFocus?: boolean;
  onActionPress: (action: string) => void;
  onSend?: (content: string) => void;
  inputRef?: React.Ref<TextInput>;
  replyingComment?: any;
}

const InputToolbar: React.FC<Props> = ({
  commentFocus,
  onSend,
  onActionPress,
  inputRef,
  replyingComment,
}) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const [isInputFocus, setInputFocus] = React.useState(false);
  const {t} = useBaseHook();

  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    replyingComment && setComment(`@${replyingComment?.user.name} ${comment}`);
  }, [replyingComment]);

  const _onSend = () => {
    onSend && onSend(comment.trim());
    setComment('');
  };

  const renderActions = () => (
    <HorizontalView style={styles.bottom}>
      <HorizontalView
        style={isInputFocus ? styles.actionsBottom : styles.actions}>
        <Icon
          style={styles.icon}
          size={18}
          icon="iconCameraOutline"
          onPress={() => onActionPress(commonActions.openCamera)}
        />
        <Icon
          style={styles.icon}
          size={18}
          icon="iconAttachment"
          onPress={() => onActionPress(commonActions.openFilePicker)}
        />
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
          placeholderTextColor={theme.colors.placeholder}
          placeholder={t('comment:placeholder_comment')}
          ref={inputRef}
          autoFocus={commentFocus}
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
