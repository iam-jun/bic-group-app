import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  StyleSheet, Platform, ScrollView, View, Image,
} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { Button } from '~/baseComponents';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import Text from '~/baseComponents/Text';
import { BUTTON_SIZES } from '~/baseComponents/Button/constants';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import images from '~/resources/images';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import useTakeQuizStore from '../TakeQuiz/store';

interface TakeQuizResultProps {
  route?: {
    params?: {
      quizId?: string;
      participantId?: string;
      contentId?: string;
    };
  };
}

const BOTTOM_SPACE = Platform.OS === 'ios' ? 38 : 24;

const TakeQuizResult: React.FC<TakeQuizResultProps> = ({ route }) => {
  const { quizId, participantId, contentId } = route.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const { rootNavigation, goHome } = useRootNavigation();
  const styles = createStyle(theme);

  const actions = useTakeQuizStore((state) => state.actions);
  const { participantResult } = useTakeQuizStore((state) => state);
  const { quizHighestScore } = usePostsStore(postsSelector.getPost(contentId, {}));
  const { score: higestScore } = quizHighestScore || {};
  const { totalTimes, score } = participantResult[participantId] || {};
  const showCongrat = score === 100;

  const onPressRetake = () => {
    onRetake();
    rootNavigation.navigate(quizStack.takeQuiz, {
      quizId,
      contentId,
    });
  };

  const onRetake = () => {
    const onSuccess = (quizParticipantId: string) => {
      actions.getQuizParticipant(quizParticipantId);
    };

    actions.startQuiz({ quizId, onSuccess });
  };

  const onPressQuit = () => {
    actions.resetDataTakingQuiz(participantId);
    actions.clearQuizParticipantId(quizId);
    goHome();
  };

  const renderResult = () => {
    if (showCongrat) {
      return (
        <Image
          resizeMode="contain"
          source={images.img_congrats}
          style={styles.img}
        />
      );
    }
    return (
      <View style={styles.circleProgress}>
        <CircularProgress
          value={score || 0}
          valueSuffix="%"
          progressValueColor={colors.neutral40}
          progressValueFontSize={24}
          activeStrokeColor={colors.purple50}
          inActiveStrokeColor={colors.purple2}
          radius={50}
          activeStrokeWidth={12}
          inActiveStrokeWidth={12}
          duration={700}
        />
      </View>
    );
  };

  const renderBlockResult = (name, value, isPercent = false) => (
    <View style={styles.blockResult}>
      <Text.BodyMMedium color={colors.neutral60}>
        { value }
        { isPercent && '%' }
      </Text.BodyMMedium>
      <ViewSpacing height={spacing.margin.small} />
      <Text.BodyS color={colors.neutral30} useI18n>
        { name }
      </Text.BodyS>
    </View>
  );

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white} testID="take_quiz_result">
      <Header
        titleTextProps={{ useI18n: true }}
        title="quiz:title_take_quiz"
        onPressBack={onPressQuit}
      />
      <ScrollView>
        <View style={styles.contentContainer}>
          {renderResult()}
          <Text.H1 useI18n color={colors.neutral80} style={styles.text}>
            {showCongrat ? t('quiz:text_awesome') : t('quiz:text_dont_give_up')}
          </Text.H1>
          <ViewSpacing height={spacing.margin.small} />
          <Text.BodyM useI18n color={colors.neutral80} style={styles.subText}>
            {showCongrat ? t('quiz:text_congrats') : t('quiz:text_study_more')}
          </Text.BodyM>
          <View style={styles.row}>
            {renderBlockResult('quiz:highest_score', higestScore || 0, true)}
            {renderBlockResult('quiz:time_take_quiz', totalTimes || 0)}
          </View>
        </View>
      </ScrollView>
      <Button.Primary
        size="large"
        useI18n
        onPress={onPressRetake}
        style={styles.btnRetakeOrRetry}
      >
        quiz:btn_retake
      </Button.Primary>
      <Button
        onPress={onPressQuit}
        style={styles.btnQuit}
      >
        <Text.ButtonM useI18n color={colors.neutral60}>
          quiz:btn_quit
        </Text.ButtonM>
      </Button>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    contentContainer: {
      paddingHorizontal: spacing.margin.large,
    },
    circleProgress: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 66,
      marginBottom: 33,
    },
    img: {
      height: 180,
      width: '100%',
      marginTop: spacing.margin.base,
    },
    text: {
      textAlign: 'center',
    },
    subText: {
      marginHorizontal: 38,
      marginBottom: 40,
      textAlign: 'center',
    },
    btnRetakeOrRetry: {
      marginTop: spacing.margin.base,
      marginHorizontal: spacing.margin.large,
      marginBottom: 20,
    },
    btnQuit: {
      marginBottom: BOTTOM_SPACE,
      marginHorizontal: spacing.margin.large,
      borderWidth: 1,
      borderColor: colors.neutral20,
      borderRadius: spacing.borderRadius.large,
      height: BUTTON_SIZES.large,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    blockResult: {
      height: 77,
      width: '48%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.purple2,
      borderRadius: spacing.borderRadius.large,
    },
  });
};

export default TakeQuizResult;
