import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';

type QuestionHeaderProps = {
    questionIndex: number;
    onPressEdit: () => void;
    isTakeQuizReview?: boolean;
}

const QuestionHeader: FC<QuestionHeaderProps> = ({
  questionIndex,
  onPressEdit,
  isTakeQuizReview = false,
}) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const renderButtonEdit = () => {
    if (isTakeQuizReview) return null;

    return (
      <Button onPress={onPressEdit}>
        <Icon size={16} tintColor={colors.neutral40} icon="PenSolid" />
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <Text.SubtitleM color={colors.neutral80}>{`${t('quiz:question')} ${questionIndex + 1}`}</Text.SubtitleM>
      {renderButtonEdit()}
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
