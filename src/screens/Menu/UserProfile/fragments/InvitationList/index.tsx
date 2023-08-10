import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useRootNavigation } from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import { spacing } from '~/theme';

const InvitationList = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const goToInvitationSettings = () => {
    rootNavigation.navigate(menuStack.invitationPrivacy);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={[styles.row, styles.textContainer]}>
        <Text.H4 useI18n>
          user:user_tab_types:title_invitations
        </Text.H4>
        <Text.LinkS useI18n onPress={goToInvitationSettings}>
          user:text_invitation_privacy_settings
        </Text.LinkS>
      </View>
      <ViewSpacing height={spacing.margin.tiny} />
      <Text.BodyM useI18n>
        user:invitation_description
      </Text.BodyM>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      backgroundColor: colors.white,
      padding: spacing.padding.large,
      marginTop: spacing.margin.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: {
      justifyContent: 'space-between',
    },
  });
};

export default InvitationList;
