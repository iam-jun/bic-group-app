import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, TextInput} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from '~/components/Icon';
import {spacing} from '~/theme';
import {margin} from '~/theme/spacing';
import ScreenWrapper from '../ScreenWrapper';
import {IObject} from '~/interfaces/common';
import HorizontalView from '../layout/HorizontalView';
import KeyboardSpacer from '../layout/KeyboardSpacer';
import {useBaseHook} from '~/hooks';
import commonActions from '~/constants/commonActions';
import IComment from '~/interfaces/IComment';
import Text from '~/components/texts/Text';

export interface Props {
  commentFocus?: boolean;
  onActionPress: (action: string) => void;
  onSend?: (content: string) => void;
  inputRef?: React.Ref<TextInput>;
  replyingComment?: IComment;
  setReplyingComment?: Function;
}

const InputToolbar: React.FC<Props> = ({
  commentFocus,
  onSend,
  onActionPress,
  inputRef,
  replyingComment,
  setReplyingComment,
}) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const [isInputFocus, setInputFocus] = React.useState(false);
  const {t} = useBaseHook();

  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    replyingComment && setComment(`@${replyingComment?.user.name} `);
  }, [replyingComment]);

  const _onSend = () => {
    onSend && onSend(comment.trim());
    setComment('');
  };

  const onCancelReply = () => {
    setComment('');
    setReplyingComment && setReplyingComment(undefined);
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
    <ScreenWrapper style={styles.wrapper}>
      {!!replyingComment && (
        <HorizontalView>
          <Text style={styles.replyText}>
            {t('comment:reply_to')}
            <Text bold>{`${replyingComment.user.name}`}</Text>
          </Text>
          <Text style={styles.replyText} bold onPress={onCancelReply}>
            {t('common:btn_cancel')}
          </Text>
        </HorizontalView>
      )}
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
    </ScreenWrapper>
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
    replyText: {
      marginStart: margin.base,
      marginBottom: margin.small,
    },
  });
};
