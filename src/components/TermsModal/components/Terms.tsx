import React from 'react';
import {
  View, StyleSheet, ViewStyle, StyleProp,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Markdown from '~/beinComponents/Markdown';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import useTermStore from '../store';

interface TermsProps {
  groupId: string;
  isActiveGroupTerms: boolean;
  style?: StyleProp<ViewStyle>;
}

const Terms = (props: TermsProps) => {
  const { style = {}, groupId, isActiveGroupTerms } = props;
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const content = useTermStore((state) => state.data?.[groupId]?.content) || '';

  if (!isActiveGroupTerms || !content) return null;

  return (
    <View style={[styles.container, style]} testID="terms">
      <Text.SubtitleL style={styles.title} useI18n>common:text_group_terms</Text.SubtitleL>
      <Markdown value={content} />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      padding: spacing.padding.large,
    },
    title: {
      marginBottom: spacing.margin.small,
    },
  });
};

export default Terms;
