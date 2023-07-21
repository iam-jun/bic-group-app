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
  style?: StyleProp<ViewStyle>;
}

const Terms = (props: TermsProps) => {
  const { style = {}, groupId } = props;
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const { data } = useTermStore((state) => state);
  const content = data[groupId]?.content;

  if (!content) return null;

  return (
    <View style={[styles.container, style]} testID="terms">
      <Text.SubtitleL useI18n>common:text_group_terms</Text.SubtitleL>
      <Markdown paragraphStyles={styles.content} value={content} />
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
    content: {
      marginTop: spacing.margin.small,
    },
  });
};

export default Terms;
