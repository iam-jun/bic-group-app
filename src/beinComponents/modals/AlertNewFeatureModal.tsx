import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Modal, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import useModal from '~/hooks/modal';
import * as actions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import NewFeatureImg from '~/../assets/images/new_feeature_purple.svg';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';

export interface NewFeatureModalProps {
  style?: StyleProp<ViewStyle>;
}

const AlertNewFeatureModal: React.FC<NewFeatureModalProps> = ({
  style,
  ...props
}: NewFeatureModalProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const title = 'Upcoming Features';
  const header = 'new_feature:text_we_are_developing_this_feature';
  const body = 'new_feature:text_we_will_notify_you';

  const {alertNewFeature} = useModal();
  const {visible} = alertNewFeature;

  const dispatch = useDispatch();

  const onRatingPress = () => {
    dispatch(actions.hideAlertNewFeature());
  };

  return (
    <Modal
      visible={visible}
      dismissable
      onDismiss={onRatingPress}
      contentContainerStyle={StyleSheet.flatten([styles.modal, style])}
      {...props}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text.ButtonBase>{title}</Text.ButtonBase>
        </View>
        <View style={styles.body}>
          <SvgIcon
            // @ts-ignore
            source={NewFeatureImg}
            width={250}
            height={200}
            tintColor="none"
          />
          <Text.H6 useI18n>{header}</Text.H6>
          <Text.Body useI18n>{body}</Text.Body>
          <View style={styles.buttonsContainer}>
            <Button.Secondary
              useI18n
              style={styles.button}
              onPress={onRatingPress}
              color={theme.colors.primary3}>
              new_feature:button_I_want_it_now
            </Button.Secondary>
            <Button.Secondary
              style={styles.button}
              useI18n
              onPress={onRatingPress}
              color={theme.colors.primary2}>
              new_feature:button_I_can_wait
            </Button.Secondary>
            <Button.Secondary
              style={styles.button}
              useI18n
              onPress={onRatingPress}>
              new_feature:button_not_really_need
            </Button.Secondary>
          </View>
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
      padding: spacing.padding.small,
    },
    header: {
      width: '100%',
    },
    body: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonsContainer: {
      width: '100%',
      marginTop: spacing.margin.extraLarge,
    },
    button: {
      marginVertical: spacing.margin.tiny,
    },
  });
};

export default AlertNewFeatureModal;
