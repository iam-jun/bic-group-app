import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import { WARNING_SECTION } from '../index';
import Icon from '~/baseComponents/Icon';

interface TextSelectedPeopleProps {
  selectedUsers: string[];
  loading?: boolean;
}

const TextSelectedPeople = ({ selectedUsers, loading = false }: TextSelectedPeopleProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();

  const renderWarning = () => {
    const color = selectedUsers.length === WARNING_SECTION.MAX ? theme.colors.red40 : theme.colors.yellow60;
    if (selectedUsers.length >= WARNING_SECTION.WARNING) {
      return (
        <View style={styles.warningContainer}>
          <Icon icon="TriangleExclamation" size={20} tintColor={color} />
          <Text.BodyM color={color} useI18n style={styles.warningText}>
            {t('common:text_maximum', { count: WARNING_SECTION.MAX })}
          </Text.BodyM>
        </View>
      );
    }
    return null;
  };

  const colorText = loading ? theme.colors.transparent1 : theme.colors.neutral60;

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <View style={styles.selectedContainer} testID="text_selected_people">
      <Text.H4 color={colorText}>
        {t('common:text_selected_people')}
        <Text.BodyL>
          ・
          {selectedUsers.length}
        </Text.BodyL>
      </Text.H4>
      {renderWarning()}
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.large,
  },
  warningContainer: {
    flexDirection: 'row',
    marginLeft: spacing.margin.base,
  },
  warningText: {
    marginLeft: spacing.margin.tiny,
  },
});

export default TextSelectedPeople;
