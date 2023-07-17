import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import LottieView from 'lottie-react-native';
import Text from '~/baseComponents/Text';
import { useRootNavigation } from '~/hooks/navigation';
import { spacing } from '~/theme';
import { LottieFileGeneratingQuiz } from '~/resources/lottieJson';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import { useBaseHook } from '~/hooks';

type GeneratingQuizProps = {};

const GeneratingQuiz: FC<GeneratingQuizProps> = () => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const onDraftPress = () => {
    rootNavigation.replace(menuStack.yourContent, { initTab: 4 });
  };

  return (
    <View testID="generating_quiz" style={styles.container}>
      <LottieView
        style={styles.loadingView}
        source={LottieFileGeneratingQuiz}
        autoPlay
        loop
      />
      <Text.H4 useI18n color={colors.neutral40} style={styles.centerText}>
        quiz:the_ai_is_carefully_crafting_your_questions
      </Text.H4>
      <Text.BodyS color={colors.neutral40} style={styles.centerText}>
        {`${t('quiz:this_may_take_up_to_a_few_minute')} `}
        <TouchableWithoutFeedback onPress={onDraftPress}>
          <Text.BodyS useI18n color={colors.blue50} style={styles.textLink}>
            post:draft:title_draft
          </Text.BodyS>
        </TouchableWithoutFeedback>
      </Text.BodyS>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerText: {
      textAlign: 'center',
    },
    textLink: {
      textDecorationLine: 'underline',
    },
    loadingView: {
      width: 45,
      height: 45,
      marginBottom: spacing.margin.base,
    },
  });
};

export default GeneratingQuiz;
