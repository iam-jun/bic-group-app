import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Modal, useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import SystemIssueImg from '~/../assets/images/SystemIssue.svg';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import noInternetKeySelector from '../redux/keySelector';
import {useKeySelector} from '~/hooks/selector';

const SystemIssueModal = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const systemIssue = useKeySelector(noInternetKeySelector.systemIssue);

  return (
    <Modal
      visible={systemIssue}
      dismissable={false}
      contentContainerStyle={styles.modal}>
      <SvgIcon
        // @ts-ignore
        source={SystemIssueImg}
        width={200}
        height={200}
        tintColor="none"
      />
      <Text.H4 useI18n>internet_connection:system_issue:title</Text.H4>
      <Text.BodyM useI18n>internet_connection:system_issue:desc</Text.BodyM>
      <View style={styles.loadingContainer}>
        <LoadingIndicator color={theme.colors.primary5} size={24} />
      </View>
    </Modal>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    modal: {
      width: 320,
      paddingTop: spacing.padding.large,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderCard,
      borderRadius: 6,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingContainer: {
      width: 40,
      height: 40,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      backgroundColor: colors.background,
      marginVertical: spacing.margin.extraLarge,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 6,
    },
  });
};

export default SystemIssueModal;
