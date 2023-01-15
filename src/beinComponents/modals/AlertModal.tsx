import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity, useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Text from '~/baseComponents/Text';
import * as actions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import TextInput from '../inputs/TextInput';
import { useKeySelector } from '~/hooks/selector';
import { Button } from '~/baseComponents';
import { useBaseHook } from '~/hooks';

export interface AlertModalProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const AlertModal: React.FC<AlertModalProps> = ({
  style,
}: AlertModalProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const { alert } = useKeySelector('modal');
  const {
    isDismissible,
    visible,
    title,
    content,
    ContentComponent,
    contentProps,
    input,
    inputProps,
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
    style: alertModalStyle,
    children = null as React.ReactNode,
    titleProps,
    buttonViewStyle,
    headerStyle,
    HeaderImageComponent,
  } = alert;
  const _cancelLabel = cancelLabel || t('common:btn_cancel');

  const Content = ContentComponent || Text.ParagraphM;

  const ConfirmBtn = ConfirmBtnComponent || Button.Primary;
  const CancelBtn = CancelBtnComponent || Button.Neutral;

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

  const _onConfirm = () => {
    dispatch(actions.hideAlert());
    onConfirm(text);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const _onPressContent = () => {};

  const optionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      visible ? 1 : 0, { duration: 500 },
    ),
  }));

  if (!visible) return null;

  const renderHeader = () => (
    <>
      {HeaderImageComponent || null}
      <View style={[styles.header, headerStyle || {}]}>
        {!!title && (
          <Text.H4 style={{ flex: 1 }} {...titleProps}>
            {title}
          </Text.H4>
        )}
      </View>
    </>
  );

  const renderContent = () => (
    <>
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
    </>
  );

  const renderFooter = () => (
    <View style={[styles.footerContainer, buttonViewStyle || {}]}>
      {!!cancelBtn && (
        <CancelBtn
          testID="alert_modal.cancel"
          type="ghost"
          style={{ marginEnd: spacing?.margin.large, minWidth: 64 }}
          onPress={_onCancel}
          {...cancelBtnProps}
        >
          {_cancelLabel}
        </CancelBtn>
      )}
      {!!visible && !!onConfirm && (
        <ConfirmBtn
          testID="alert_modal.confirm"
          disabled={input && !text}
          style={{ minWidth: 64 }}
          onPress={_onConfirm}
          {...confirmBtnProps}
        >
          {confirmLabel || t('common:btn_confirm')}
        </ConfirmBtn>
      )}
    </View>
  );

  return (
    <Animated.View style={[styles.root, optionsStyle]}>
      <TouchableOpacity
        style={styles.root}
        activeOpacity={1}
        onPress={isDismissible ? _onDismiss : undefined}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={_onPressContent}
            style={[styles.modalContainer, style, alertModalStyle]}
          >
            {renderHeader()}
            {renderContent()}
            {renderFooter()}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const { width } = useWindowDimensions();

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
      backgroundColor: colors.neutral,
    },
    modalContainer: {
      borderColor: colors.gray20,
      borderRadius: spacing.borderRadius.large,
      borderWidth: 1,
      width: Math.min(width * 0.8, 400),
      backgroundColor: colors.neutral,
      alignSelf: 'center',
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingVertical: spacing.padding.base,
      paddingRight: spacing.padding.extraLarge,
      borderTopWidth: 1,
      borderColor: colors.neutral5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: colors.neutral5,
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
    closeButton: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingTop: spacing.padding.tiny,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default AlertModal;
