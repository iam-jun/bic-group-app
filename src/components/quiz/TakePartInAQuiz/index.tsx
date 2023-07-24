import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Image from '~/components/Image';
import { useBaseHook } from '~/hooks';
import { QuizPost, QuizStatus } from '~/interfaces/IQuiz';
import images from '~/resources/images';
import { spacing } from '~/theme';

type TakePartInAQuizProps = {
  quiz: QuizPost;
  onPressTakeQuiz?: (quizId: string) => void;
  style?: StyleProp<ViewStyle>;
  shouldShowDraftQuiz?: boolean;
};

const TakePartInAQuiz: FC<TakePartInAQuizProps> = ({
  quiz,
  onPressTakeQuiz,
  style,
  shouldShowDraftQuiz,
}) => {
  const {
    title, description, id, status,
  } = quiz || {};
  const canTakeQuiz = status === QuizStatus.PUBLISHED;

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const onPress = () => {
    if (canTakeQuiz) {
      onPressTakeQuiz?.(id);
    }
  };

  // when status is not PUBLISHED and ContentItem is rendered in Newfeed
  // so we should not render this component
  if (!canTakeQuiz && !shouldShowDraftQuiz) return null;

  return (
    <Button onPress={onPress}>
      <View style={[styles.container, style]}>
        <Image style={styles.img} source={images.img_thumbnail_take_part_in_a_quiz} />
        <ViewSpacing width={spacing.margin.small} />
        <View style={{ flex: 1 }}>
          <Text.SubtitleM
            color={!!title ? colors.neutral40 : colors.neutral20}
            numberOfLines={1}
          >
            {!!title ? title : t('quiz:empty_title_quiz')}
          </Text.SubtitleM>
          <Text.BodyXS
            color={!!description ? colors.neutral40 : colors.neutral20}
            numberOfLines={2}
          >
            {!!description ? description : t('quiz:empty_description_quiz')}
          </Text.BodyXS>
        </View>
        <ViewSpacing width={spacing.margin.small} />
        <Icon size={24} tintColor={colors.neutral40} icon="ChevronRight" />
      </View>
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral5,
      borderRadius: spacing.borderRadius.large,
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
      padding: spacing.padding.large,
    },
    img: {
      width: 64,
      height: 64,
    },
  });
};

export default TakePartInAQuiz;
