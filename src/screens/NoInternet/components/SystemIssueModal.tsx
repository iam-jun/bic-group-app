import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Modal} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import SystemIssueImg from '~/../assets/images/SystemIssue.svg';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import noInternetKeySelector from '../redux/keySelector';
import {useKeySelector} from '~/hooks/selector';
import spacing from '~/theme/spacing';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

const SystemIssueModal = () => {
  const theme: ExtendedTheme = useTheme() as ExtendedTheme;
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
      <Text.Body useI18n>internet_connection:system_issue:desc</Text.Body>
      <View style={styles.loadingContainer}>
        <LoadingIndicator color={theme.colors.purple30} size={24} />
      </View>
    </Modal>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    modal: {
      width: 320,
      paddingTop: spacing.padding.large,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.gray40,
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
      backgroundColor: colors.white,
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
