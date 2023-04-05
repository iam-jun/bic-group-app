import React, { useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Keyboard, KeyboardAvoidingView, Platform,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  FadeInDown, FadeOutUp,
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import useMemberQuestionsStore from './store';
import { Button } from '~/baseComponents';
import useCommunityController from '~/screens/communities/store';
import IDiscoverGroupsState from '~/screens/groups/DiscoverGroups/store/Interface';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import TextQuestion from './TextQuestion';
import useTermStore, { TermsInfo } from '../TermsModal/store';
import useBaseHook from '~/hooks/baseHook';
import { IMembershipQuestion, MembershipAnswerRequest } from '~/interfaces/ICommunity';

const MemberQuestionsModal = () => {
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const { t } = useBaseHook();

  const actions = useMemberQuestionsStore((state) => state.actions);
  const type = useMemberQuestionsStore((state) => state.type);
  const groupId = useMemberQuestionsStore((state) => state.groupId);
  const rootGroupId = useMemberQuestionsStore((state) => state.rootGroupId);
  const name = useMemberQuestionsStore((state) => state.name);
  const questionsIds = useMemberQuestionsStore((state) => state.ids);
  const isActive = useMemberQuestionsStore((state) => state.isActive);
  const isActiveGroupTerms = useMemberQuestionsStore((state) => state.isActiveGroupTerms);
  const isOpen = useMemberQuestionsStore((state) => state.isOpen);
  const resetTerms = useMemberQuestionsStore((state) => state.reset);
  const answers = useMemberQuestionsStore((state) => state.answers);
  const questions = useMemberQuestionsStore((state) => state.questions);

  const comActions = useCommunityController((state) => state.actions);
  const groupActions = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.actions);

  const termsActions = useTermStore((state) => state.actions);

  useEffect(() => {
    if (isActive && rootGroupId) {
      actions.getQuestions(rootGroupId);
    }
  }, [isActive, rootGroupId]);

  useEffect(() => {
    if (!isOpen) {
      resetTerms();
    } else {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  const onClose = () => {
    actions.setIsOpen(false);
  };

  const onSubmit = () => {
    if (isActiveGroupTerms) {
      const payload: TermsInfo = {
        groupId,
        rootGroupId,
        name,
        type,
        isActive: true,
      };
      termsActions.setTermInfo(payload);
      actions.setIsOpen(false);
      return;
    }

    if (type === 'community') {
      comActions.joinCommunity(groupId, name);
    } else {
      groupActions.joinNewGroup(groupId);
    }
    actions.setIsOpen(false);
  };

  if (!isOpen) return null;

  const buttonText = isActiveGroupTerms ? t('common:btn_submit') : t('common:btn_next');
  const enableButton = checkAnsweredRequiredQuestion(questions, answers);

  return (
    <Animated.View
      testID="member_questions.view"
      style={styles.screenContainer}
      entering={FadeInDown}
      exiting={FadeOutUp}
    >
      <View style={styles.screenContainer}>
        <Header
          title="common:text_answer_title"
          titleTextProps={{ useI18n: true }}
          onPressBack={onClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            scrollEventThrottle={16}
          >
            {questionsIds?.map((item: string) => (
              <TextQuestion
                key={`membership_question_${item}`}
                questionId={item}
              />
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.buttonView} testID="join_cancel_button">
          <Button.Secondary
            testID="terms_view.sumbit"
            disabled={!enableButton}
            onPress={onSubmit}
          >
            {buttonText}
          </Button.Secondary>
        </View>
      </View>
    </Animated.View>
  );
};

const checkAnsweredRequiredQuestion = (questions: {[id: string]: IMembershipQuestion},
  answers: {[id: string]: MembershipAnswerRequest}) => {
  const questionArray = Object.values(questions);
  for (let index = 0; index < questionArray.length; index++) {
    const question = questionArray[index];
    const text = answers?.[question.id]?.answer;
    if (question.isRequired && !!text) {
      return false;
    }
  }
  return true;
};

const createStyles = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;
  return StyleSheet.create({
    screenContainer: {
      zIndex: 100,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
    },
    body: {
      flex: 1,
    },
    buttonsContainer: {
      flex: 1,
      width: '100%',
      maxWidth: 271,
      marginTop: spacing.margin.extraLarge,
    },
    button: {
      marginVertical: spacing.margin.tiny,
    },
    buttonView: {
      zIndex: 2,
      position: 'absolute',
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.large + insets.bottom,
      paddingTop: spacing.padding.large,
      bottom: 0,
      left: 0,
      right: 0,
    },
    checkbox: {
      marginTop: spacing.margin.large,
    },
    contentContainerStyle: {
      backgroundColor: colors.white,
      padding: spacing.padding.large,
    },
  });
};
export default MemberQuestionsModal;
