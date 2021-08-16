import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
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
    isDismissable,
    visible,
    title,
    content,
    input,
    inputProps,
    iconName,
    onConfirm,
    onDissmiss,
    confirmLabel,
    cancelBtn,
  } = alert;

  const dispatch = useDispatch();

  const _onDismiss = () => {
    onDissmiss && onDissmiss();
    dispatch(actions.hideAlert());
  };
  const [text, setText] = useState(inputProps?.value || '');
  useEffect(() => {
    setText(inputProps?.value || '');
  }, [inputProps]);

  return (
    <Modal
      visible={visible}
      dismissable={isDismissable}
      onDismiss={_onDismiss}
      contentContainerStyle={StyleSheet.flatten([styles.modal, style])}
      {...props}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text.ButtonBase>{title}</Text.ButtonBase>
          <Icon icon={iconName} size={20} tintColor={theme.colors.iconTint} />
        </View>
        {!!content && (
          <Text.Subtitle style={styles.content}>{content}</Text.Subtitle>
        )}
        {input && (
          <TextInput
            {...inputProps}
            value={text}
            onChangeText={(value: string) => setText(value)}
            onClearText={() => inputProps.onClearText && setText('')}
          />
        )}
        <View style={styles.displayBtn}>
          {cancelBtn && (
            <Button.Secondary
              style={{marginEnd: theme.spacing?.margin.base}}
              textColor={theme.colors.primary7}
              color={theme.colors.primary2}
              onPress={_onDismiss}>
              {i18next.t('common:btn_cancel')}
            </Button.Secondary>
          )}

          <Button.Secondary
            textColor={theme.colors.background}
            color={theme.colors.primary7}
            onPress={() => {
              dispatch(actions.hideAlert());
              onConfirm(text);
            }}>
            {confirmLabel}
          </Button.Secondary>
        </View>
      </View>
    </Modal>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    modal: {
      width: 320,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderCard,
      borderRadius: 6,
      alignSelf: 'center',
    },
    container: {
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
