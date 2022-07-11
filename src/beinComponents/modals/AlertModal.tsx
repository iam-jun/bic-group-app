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
import spacing from '~/theme/spacing';
import Icon from '../Icon';
import TextInput from '../inputs/TextInput';

export interface AlertModalProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
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
    ContentComponent,
    contentProps,
    input,
    inputProps,
    iconName,
    onCancel,
    onConfirm,
    onDismiss,
    confirmLabel,
    confirmBtnProps,
    ConfirmBtnComponent,
    cancelBtn,
    cancelLabel,
    cancelBtnProps,
    CancelBtnComponent,
    showCloseButton,
    style: alertModalStyle,
    children = null as React.ReactNode,
    titleProps,
    buttonViewStyle,
    headerStyle,
    HeaderImageComponent,
  } = alert;
  const _cancelLabel = cancelLabel
    ? cancelLabel
    : i18next.t('common:btn_cancel');

  const _ContentComponent = ContentComponent || Text.Subtitle;

  const _ConfirmBtnComponent = ConfirmBtnComponent || Button.Secondary;
  const _CancelBtnComponent = CancelBtnComponent || Button.Secondary;

  const dispatch = useDispatch();
  const [text, setText] = useState(inputProps?.value || '');

  useEffect(() => {
    setText(inputProps?.value || '');
  }, [inputProps]);

  const _onDismiss = () => {
    onDismiss && onDismiss();
    dispatch(actions.hideAlert());
  };

  const _onCancel = () => {
    if (onCancel) {
      onCancel();
      dispatch(actions.hideAlert());
    } else {
      _onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      dismissable={isDismissible}
      onDismiss={_onDismiss}
      contentContainerStyle={[styles.modal, style, alertModalStyle]}
      {...props}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalContainer}>
          {!!HeaderImageComponent ? HeaderImageComponent : null}
          <View style={[styles.header, !!headerStyle ? headerStyle : {}]}>
            {!!title && (
              <Text.ButtonBase {...titleProps}>{title}</Text.ButtonBase>
            )}
            {!!iconName && (
              <Icon
                icon={iconName}
                size={20}
                tintColor={theme.colors.iconTint}
              />
            )}
            {showCloseButton && (
              <View style={styles.closeButton}>
                <Icon
                  icon={'iconClose'}
                  size={14}
                  tintColor={theme.colors.iconTint}
                  onPress={_onDismiss}
                />
              </View>
            )}
          </View>
          {children}
          {!!content && (
            <_ContentComponent style={styles.content} {...contentProps}>
              {content}
            </_ContentComponent>
          )}
          {input && (
            <TextInput
              onChangeText={(value: string) => setText(value)}
              autoFocus
              {...inputProps}
            />
          )}
          <View
            style={[
              styles.displayBtn,
              !!buttonViewStyle ? buttonViewStyle : {},
            ]}>
            {!!cancelBtn && (
              <_CancelBtnComponent
                testID="alert_modal.cancel"
                style={{marginEnd: spacing?.margin.base}}
                onPress={_onCancel}
                {...cancelBtnProps}>
                {_cancelLabel}
              </_CancelBtnComponent>
            )}
            {!!visible && onConfirm && (
              <_ConfirmBtnComponent
                highEmphasis
                testID="alert_modal.confirm"
                disabled={input && !text}
                onPress={() => {
                  dispatch(actions.hideAlert());
                  onConfirm(text);
                }}
                {...confirmBtnProps}>
                {confirmLabel || i18next.t('common:btn_confirm')}
              </_ConfirmBtnComponent>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;
  const defaultAlertWidth = 320;

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    modal: {
      width: defaultAlertWidth,
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
    closeButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.placeholder,
      borderRadius: 6,
    },
    content: {},
  });
};

export default AlertModal;
