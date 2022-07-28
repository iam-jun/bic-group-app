import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import useModal from '~/hooks/modal';
import * as actions from '~/store/modal/actions';
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
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const { alert } = useModal();
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
  const _cancelLabel = cancelLabel || i18next.t('common:btn_cancel');

  const Content = ContentComponent || Text.BodyS;

  const ConfirmBtn = ConfirmBtnComponent || Button.Secondary;
  const CancelBtn = CancelBtnComponent || Button.Secondary;

  const dispatch = useDispatch();
  const [text, setText] = useState(inputProps?.value || '');

  useEffect(
    () => {
      setText(inputProps?.value || '');
    }, [inputProps],
  );

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const _onPressContent = () => {};

  const optionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      visible ? 1 : 0, { duration: 500 },
    ),
  }));

  if (!visible) return null;
  return (
    <Animated.View style={[styles.root, optionsStyle]}>
      <TouchableOpacity
        style={styles.root}
        activeOpacity={1}
        onPress={isDismissible ? _onDismiss : undefined}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={_onPressContent}
            style={[styles.modalContainer, style, alertModalStyle]}
          >
            {HeaderImageComponent || null}
            <View style={[styles.header, headerStyle || {}]}>
              {!!title && <Text.ButtonM {...titleProps}>{title}</Text.ButtonM>}
              {!!iconName && (
                <Icon
                  icon={iconName}
                  size={20}
                  tintColor={theme.colors.neutral80}
                />
              )}
              {showCloseButton && (
                <View style={styles.closeButton}>
                  <Icon
                    icon="iconClose"
                    size={14}
                    tintColor={theme.colors.neutral80}
                    onPress={_onDismiss}
                  />
                </View>
              )}
            </View>
            {children}
            {!!content && (
              <Content style={styles.content} {...contentProps}>
                {content}
              </Content>
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
                buttonViewStyle || {},
              ]}
            >
              {!!cancelBtn && (
                <CancelBtn
                  testID="alert_modal.cancel"
                  style={{ marginEnd: spacing?.margin.base }}
                  onPress={_onCancel}
                  {...cancelBtnProps}
                >
                  {_cancelLabel}
                </CancelBtn>
              )}
              {!!visible && onConfirm && (
                <ConfirmBtn
                  highEmphasis
                  testID="alert_modal.confirm"
                  disabled={input && !text}
                  onPress={() => {
                    dispatch(actions.hideAlert());
                    onConfirm(text);
                  }}
                  {...confirmBtnProps}
                >
                  {confirmLabel || i18next.t('common:btn_confirm')}
                </ConfirmBtn>
              )}
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const defaultAlertWidth = 320;

  return StyleSheet.create({
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.transparent1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    modal: {
      backgroundColor: colors.white,
    },
    modalContainer: {
      borderColor: colors.gray20,
      borderRadius: 6,
      borderWidth: 1,
      paddingHorizontal: spacing?.padding.extraLarge,
      paddingVertical: spacing?.padding.large,
      width: defaultAlertWidth,
      backgroundColor: colors.white,
      alignSelf: 'center',
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
      backgroundColor: colors.neutral5,
      borderRadius: 6,
    },
    content: {},
  });
};

export default AlertModal;
