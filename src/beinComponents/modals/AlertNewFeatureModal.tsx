import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Modal, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Text from '~/beinComponents/Text';
import useModal from '~/hooks/modal';
import * as actions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import NewFeatureImg from '~/../assets/images/new_feeature_purple.svg';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import Icon from '~/beinComponents/Icon';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';

export interface NewFeatureModalProps {
  style?: StyleProp<ViewStyle>;
}

const AlertNewFeatureModal: React.FC<NewFeatureModalProps> = ({
  style,
  ...props
}: NewFeatureModalProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {alertNewFeature} = useModal();
  const {visible} = alertNewFeature;

  const dispatch = useDispatch();

  const onDismiss = () => {
    dispatch(actions.hideAlertNewFeature());
  };

  return (
    <Modal
      visible={visible}
      dismissable
      onDismiss={onDismiss}
      contentContainerStyle={StyleSheet.flatten([styles.modal, style])}
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
            color={theme.colors.primary3}>
            common:text_got_it
          </Button.Secondary>
        </View>
      </View>
    </Modal>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;

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
