import { ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import PillTabButton from '~/baseComponents/Tab/PillTabButton';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';

interface TabButtonHeaderProps {
  isMember: boolean
  onPressDiscover?: () => void;
  onPressAbout?: () => void;
  onPressMembers?: () => void;
}

const TabButtonHeader = ({
  isMember, onPressDiscover, onPressAbout, onPressMembers,
}: TabButtonHeaderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      alwaysBounceHorizontal={false}
      style={styles.container}
      contentContainerStyle={styles.buttonContainer}
    >
      {onPressAbout && (
        <>
          <PillTabButton useI18n testID="tab_button_header.about_btn" size="medium" onPress={onPressAbout}>
            groups:group_content:btn_about
          </PillTabButton>
          <ViewSpacing width={spacing.margin.small} />
        </>
      )}
      {isMember && onPressDiscover && (
        <>
          <PillTabButton useI18n testID="tab_button_header.discover_btn" size="medium" onPress={onPressDiscover}>
            groups:group_content:btn_discover
          </PillTabButton>
          <ViewSpacing width={spacing.margin.small} />
        </>
      )}
      {onPressMembers && (
        <PillTabButton useI18n testID="tab_button_header.members_btn" size="medium" onPress={onPressMembers}>
          groups:group_content:btn_members
        </PillTabButton>
      )}
    </ScrollView>
  );
};

export default TabButtonHeader;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.tiny,
      backgroundColor: colors.white,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.base,
      backgroundColor: colors.white,
    },
  });
};
