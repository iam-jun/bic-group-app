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
import { useUserIdAuth } from '~/hooks/auth';
import { QuizHighestScore, QuizPost, QuizStatus } from '~/interfaces/IQuiz';
import { IAudienceUser } from '~/interfaces/IPost';
import images from '~/resources/images';
import { spacing } from '~/theme';
import { onPressTakeQuiz, onViewReport } from './helper';
import CirclePercentage from '~/baseComponents/CirclePercentage';
import { fontFamilies } from '~/theme/fonts';
import { sizes } from '~/theme/dimension';

type TakePartInAQuizProps = {
  quiz: QuizPost;
  contentId: string;
  quizHighestScore: QuizHighestScore;
  actor: IAudienceUser;
  style?: StyleProp<ViewStyle>;
  shouldShowDraftQuiz?: boolean;
};

const TakePartInAQuiz: FC<TakePartInAQuizProps> = ({
  quiz,
  contentId,
  quizHighestScore,
  actor,
  style,
  shouldShowDraftQuiz,
}) => {
  const {
    title, description, id, status,
  } = quiz || {};
  const canTakeQuiz = status === QuizStatus.PUBLISHED;
  const { score } = quizHighestScore || {};

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const userId = useUserIdAuth();

  const isActor = actor?.id === userId;
  const shouldBeHiddenViewReport = !isActor || !quiz;

  const onPress = () => {
    if (canTakeQuiz) {
      onPressTakeQuiz(id, contentId);
    }
  };

  const onPressViewReport = () => {
    if (canTakeQuiz) {
      onViewReport(contentId);
    }
  };

  const renderTextViewReport = () => {
    if (!canTakeQuiz) return null;

    if (shouldBeHiddenViewReport) {
      return (
        <Text.ParagraphS useI18n color={colors.neutral40}>
          quiz:text_start_quiz
        </Text.ParagraphS>
      );
    }

    return (
      <Text style={styles.textViewReport} useI18n onPress={onPressViewReport}>
        quiz:text_view_report
      </Text>
    );
  };

  const renderResult = () => {
    if (!quizHighestScore) return null;

    if (score === 100) {
      return (
        <View style={styles.viewPass} testID="take_part_in_quiz.pass_view">
          <Text.SubtitleS useI18n color={colors.purple50}>
            quiz:pass_quiz
          </Text.SubtitleS>
        </View>
      );
    }

    return (
      <CirclePercentage
        percent={score || 0}
        ringBgColor={colors.neutral5}
        ringColor={colors.purple50}
        textFontColor={colors.purple50}
      />
    );
  };

  // when status is not PUBLISHED and ContentItem is rendered in Newfeed
  // so we should not render this component
  if (!canTakeQuiz && !shouldShowDraftQuiz) return null;

  return (
    <Button onPress={onPress} testID="take_part_in_quiz.content">
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
          <ViewSpacing height={spacing.margin.tiny} />
          <Text.BodyXS
            color={!!description ? colors.neutral40 : colors.neutral20}
            numberOfLines={2}
          >
            {!!description ? description : t('quiz:empty_description_quiz')}
          </Text.BodyXS>
          <ViewSpacing height={spacing.margin.tiny} />
          {renderTextViewReport()}
        </View>
        <ViewSpacing width={spacing.margin.small} />
        <View style={styles.viewResult}>
          {renderResult()}
        </View>
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
    viewResult: {
      marginRight: spacing.margin.tiny,
    },
    viewPass: {
      backgroundColor: colors.purple2,
      paddingHorizontal: spacing.padding.base,
      paddingVertical: spacing.padding.tiny,
      borderRadius: spacing.borderRadius.base,
    },
    textViewReport: {
      fontFamily: fontFamilies.BeVietnamProLight,
      color: colors.blue50,
      textDecorationLine: 'underline',
      fontSize: sizes.bodyS,
    },
  });
};

export default TakePartInAQuiz;
