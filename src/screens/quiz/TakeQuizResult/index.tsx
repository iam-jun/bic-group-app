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

interface TakeQuizResultProps {
    route?: {
        params?: {
            showCongrat?: boolean; // temporary use for UI
        };
    };
}

const BOTTOM_SPACE = Platform.OS === 'ios' ? 38 : 24;

const TakeQuizResult: React.FC<TakeQuizResultProps> = ({ route }) => {
  const { showCongrat } = route.params || {}; // temporary use for UI

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const { rootNavigation, goHome } = useRootNavigation();
  const styles = createStyle(theme);

  const onPressRetakeOrRetry = () => {
    rootNavigation.navigate(quizStack.takeQuiz, {});
  };

  const onPressQuit = () => {
    goHome();
  };

  const renderResult = () => {
    // temporary use for UI
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
          value={88}
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

  const renderBlockResult = (name, value, isNoted = false) => {
    const showNoted = value > 0 && isNoted;

    return (
      <View style={styles.blockResult}>
        <Text.BodyMMedium color={showNoted ? colors.red40 : colors.neutral60}>
          { value }
          %
        </Text.BodyMMedium>
        <ViewSpacing height={spacing.margin.small} />
        <Text.BodyS color={colors.neutral30} useI18n>
          { name }
        </Text.BodyS>
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white} testID="take_quiz_result">
      <Header
        titleTextProps={{ useI18n: true }}
        title="quiz:title_take_quiz"
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
            {renderBlockResult('quiz:result_complete', showCongrat ? 100 : 88)}
            {renderBlockResult('quiz:result_correct', showCongrat ? 100 : 79)}
          </View>
          <ViewSpacing height={spacing.margin.large} />
          <View style={styles.row}>
            {renderBlockResult('quiz:result_incorrect', showCongrat ? 0 : 15, !showCongrat)}
            {renderBlockResult('quiz:result_skip', showCongrat ? 0 : 9)}
          </View>
        </View>
      </ScrollView>
      <Button.Primary
        size="large"
        useI18n
        onPress={onPressRetakeOrRetry}
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
      marginBottom: spacing.margin.extraLarge,
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
