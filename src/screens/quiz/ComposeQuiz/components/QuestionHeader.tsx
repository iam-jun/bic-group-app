import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';

type QuestionHeaderProps = {
    index: number;
    onPressEdit: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QuestionHeader: FC<QuestionHeaderProps> = ({ index, onPressEdit }) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Text.SubtitleM color={colors.neutral80}>{`${t('quiz:question')} ${index + 1}`}</Text.SubtitleM>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.margin.large,
    },
  });
};

export default QuestionHeader;
