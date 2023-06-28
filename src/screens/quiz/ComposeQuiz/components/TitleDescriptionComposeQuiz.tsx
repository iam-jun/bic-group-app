import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';

type TitleDescriptionComposeQuizProps = {
  title: string;
  description: string;
};

const TitleDescriptionComposeQuiz: FC<TitleDescriptionComposeQuizProps> = ({
  title,
  description,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  return (
    <View>
      <Text.SubtitleL color={colors.neutral80} style={styles.textTitle}>
        {title}
      </Text.SubtitleL>
      {!!description && (
        <Text.BodyM color={colors.neutral80} style={styles.textDescription}>
          {description}
        </Text.BodyM>
      )}
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  textTitle: {
    marginBottom: spacing.padding.small,
  },
  textDescription: {
    marginBottom: spacing.padding.large,
  },
});

export default TitleDescriptionComposeQuiz;
