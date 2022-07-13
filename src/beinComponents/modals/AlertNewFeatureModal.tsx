import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle, Modal} from 'react-native';
import {useDispatch} from 'react-redux';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {Portal} from 'react-native-portalize';

import Text from '~/beinComponents/Text';
import useModal from '~/hooks/modal';
import * as actions from '~/store/modal/actions';
import NewFeatureImg from '~/../assets/images/new_feeature_purple.svg';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';

export interface NewFeatureModalProps {
  style?: StyleProp<ViewStyle>;
}

const AlertNewFeatureModal: React.FC<NewFeatureModalProps> = ({
  style,
  ...props
}: NewFeatureModalProps) => {
  const theme = useTheme() as ExtendedTheme;
  const styles = themeStyles(theme);

  const {alertNewFeature} = useModal();
  const {visible} = alertNewFeature;

  const dispatch = useDispatch();

  const onDismiss = () => {
    dispatch(actions.hideAlertNewFeature());
  };

  return (
    // <Portal>
    <Modal
      visible={visible}
      // dismissable
      animationType="fade"
      // transparent
      onDismiss={onDismiss}
      style={StyleSheet.flatten([styles.modal])}
      // presentationStyle="overFullScreen"
      // contentContainerStyle={StyleSheet.flatten([styles.modal, style])}
      {...props}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text.H6>Upcoming Features</Text.H6>
        </View>
        <View style={styles.body}>
          <SvgIcon
            // @ts-ignore
            source={NewFeatureImg}
            width={250}
            height={200}
            tintColor="none"
          />
          <Text.H6 useI18n>
            new_feature:text_we_are_developing_this_feature
          </Text.H6>
          <Text.Body useI18n>new_feature:text_we_will_notify_you</Text.Body>

          {/* Temporary button */}
          <Button.Secondary
            style={{
              marginTop: spacing.margin.large,
              paddingHorizontal: spacing.padding.large,
            }}
            onPress={onDismiss}
            useI18n
            color={theme.colors.purple10}>
            common:text_got_it
          </Button.Secondary>
        </View>
      </View>
    </Modal>
    // </Portal>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    modal: {
      backgroundColor: colors.red1,
      // flex: 1,
      // alignContent: 'center',
      // justifyContent: 'center',
    },
    container: {
      width: 320,
      borderColor: colors.gray40,
      padding: spacing.padding.small,
      backgroundColor: colors.white,
      // alignSelf: 'center',
      borderWidth: 1,
      borderRadius: 6,
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
    closeIcon: {
      marginRight: spacing.margin.small,
    },
    body: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.margin.large,
      paddingHorizontal: spacing.padding.small,
    },
  });
};

export default AlertNewFeatureModal;
