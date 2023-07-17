import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { Button } from '~/baseComponents';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import Text from '~/baseComponents/Text';
import { BUTTON_SIZES } from '~/baseComponents/Button/constants';

interface TakeQuizResultProps {

}

const BOTTOM_SPACE = Platform.OS === 'ios' ? 38 : 24;

const TakeQuizResult: React.FC<TakeQuizResultProps> = () => {
    const theme: ExtendedTheme = useTheme();
    const { colors } = theme;
    const { t } = useBaseHook();
    const { rootNavigation, goHome } = useRootNavigation();
    const styles = createStyle(theme);

    const onPressRetakeOrRetry = () => {
        rootNavigation.navigate(quizStack.takeQuiz, {});
    }

    const onPressQuit = () => {
        goHome();
    };


    return (
        <ScreenWrapper isFullView backgroundColor={colors.white} testID="take_quiz_result">
            <Header
                titleTextProps={{ useI18n: true }}
                title="quiz:title_take_quiz"
            />
            <ScrollView>

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
        containerContent: {
    
        },
        btnRetakeOrRetry: {
            marginTop: spacing.margin.base,
            marginHorizontal: spacing.margin.large,
            marginBottom: spacing.margin.base,
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
    });
};

export default TakeQuizResult;
