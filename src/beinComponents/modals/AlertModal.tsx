import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Modal, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import useModal from '~/hooks/modal';
import * as actions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import Icon from '../Icon';
import TextInput from '../inputs/TextInput';

export interface AlertModalProps {
  style?: StyleProp<ViewStyle>;
}

const AlertModal: React.FC<AlertModalProps> = ({
  style,
  ...props
}: AlertModalProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {alert} = useModal();
  const {
    isDismissible,
    visible,
    title,
    content,
    input,
    inputProps,
    iconName,
    onConfirm,
    onDismiss,
    confirmLabel,
    cancelBtn,
    cancelLabel,
  } = alert;
  const _cancelLabel = cancelLabel
    ? cancelLabel
    : i18next.t('common:btn_cancel');

  const dispatch = useDispatch();
  const [text, setText] = useState(inputProps?.value || '');

  useEffect(() => {
    setText(inputProps?.value || '');
  }, [inputProps]);

  const _onDismiss = () => {
    onDismiss && onDismiss();
    dispatch(actions.hideAlert());
  };

  return (
    <Modal
      visible={visible}
      dismissable={isDismissible}
      onDismiss={_onDismiss}
      contentContainerStyle={StyleSheet.flatten([styles.modal, style])}
      {...props}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text.ButtonBase>{title}</Text.ButtonBase>
            {!!iconName && (
              <Icon
                icon={iconName}
                size={20}
                tintColor={theme.colors.iconTint}
              />
            )}
          </View>
          {!!content && (
            <Text.Subtitle style={styles.content}>{content}</Text.Subtitle>
          )}
          {input && (
            <TextInput
              onChangeText={(value: string) => setText(value)}
              autoFocus
              {...inputProps}
            />
          )}
          <View style={styles.displayBtn}>
            {!!cancelBtn && (
              <Button.Secondary
                style={{marginEnd: theme.spacing?.margin.base}}
                textColor={theme.colors.primary7}
                color={theme.colors.primary2}
                onPress={_onDismiss}>
                {_cancelLabel}
              </Button.Secondary>
            )}

            {!!confirmLabel && (
              <Button.Secondary
                textColor={theme.colors.background}
                color={theme.colors.primary7}
                disabled={input && !text}
                onPress={() => {
                  dispatch(actions.hideAlert());
                  onConfirm && onConfirm(text);
                }}>
                {confirmLabel}
              </Button.Secondary>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    modal: {
      width: 320,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderCard,
      borderRadius: 6,
      alignSelf: 'center',
    },
    modalContainer: {
      paddingHorizontal: spacing?.padding.extraLarge,
      paddingVertical: spacing?.padding.large,
    },
    displayBtn: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: spacing?.margin.extraLarge,
    },
    header: {
      marginBottom: spacing?.margin.base,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {},
  });
};

export default AlertModal;
