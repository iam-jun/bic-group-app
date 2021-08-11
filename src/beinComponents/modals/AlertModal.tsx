import React from 'react';
import {StyleProp, StyleSheet, ViewStyle, View} from 'react-native';
import {useTheme, Modal} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {ITheme} from '~/theme/interfaces';
import Icon from '../Icon';
import useModal from '~/hooks/modal';
import * as actions from '~/store/modal/actions';

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
    iconName,
    onConfirm,
    confirmLabel,
    cancelBtn,
  } = alert;

  const dispatch = useDispatch();

  const _onDismiss = () => dispatch(actions.hideAlert());

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
        <Text.Subtitle style={styles.content}>{content}</Text.Subtitle>

        <View style={styles.displayBtn}>
          {cancelBtn && (
            <Button.Secondary
              style={{marginEnd: theme.spacing?.margin.base}}
              textColor={theme.colors.primary7}
              color={theme.colors.primary2}
              onPress={_onDismiss}>
              Cancel
            </Button.Secondary>
          )}

          <Button.Secondary
            textColor={theme.colors.background}
            color={theme.colors.primary7}
            onPress={() => {
              dispatch(actions.hideAlert());
              onConfirm();
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
      height: 148,
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
