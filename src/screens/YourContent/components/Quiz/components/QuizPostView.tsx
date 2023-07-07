import React, { FC, useState } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import { IPost } from '~/interfaces/IPost';
import { GenStatus } from '~/interfaces/IQuiz';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import { Button } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Divider from '~/beinComponents/Divider';
import { PostBody, PostHeader, PostImportant } from '~/components/posts';
// import useModalStore from '~/store/modal';
// import useDraftQuizStore from '../store';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';

export interface QuizPostViewProps {
  data: IPost;
  style?: StyleProp<ViewStyle>;
}

const onDoNothing = () => true;

const QuizPostView: FC<QuizPostViewProps> = ({
  data,
  style,
}) => {
  const [publishing, setPublishing] = useState(false);

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

//   const actions = useDraftQuizStore((state) => state.actions);
//   const modalActions = useModalStore((state) => state.actions);

  const {
    id,
    setting,
    communities,
    quiz,
  } = data || {};

  const { genStatus } = quiz || {};

  const { isImportant, importantExpiredAt } = setting || {};
  const isProcessing = genStatus === GenStatus.PROCESSING;

  const disableButtonPost = genStatus === GenStatus.FAILED || genStatus === GenStatus.PROCESSING || genStatus === GenStatus.PENDING;

//   const refreshDraftQuiz = () => {
//   };

  const onCreateQuiz = () => {
    if (id) {
      // do somethings
    }
  };

  const onPressEdit = () => {
    rootNavigation.navigate(
      quizStack.composeQuiz, {
        contentId: id,
      },
    );
  };

//   const onDelete = () => {
//   };

  const onPressDelete = () => {
    // modalActions.hideModal();
    // modalActions.showAlert({
    //   title: t('post:title_delete_quiz'),
    //   content: t('post:content_delete_quiz'),
    //   cancelBtn: true,
    //   cancelLabel: t('common:btn_cancel'),
    //   confirmLabel: t('common:btn_delete'),
    //   ConfirmBtnComponent: Button.Danger,
    //   confirmBtnProps: { type: 'ghost' },
    //   onConfirm: onDelete,
    // });
  };

  const renderFooter = () => {
    if (isProcessing) {
      return (
        <Text.BodyS
          testID="quiz_draft_view.quiz_processing_publish"
          color={colors.gray50}
          style={styles.draftText}
        >
          {t('quiz:draft:text_processing_publish')}
        </Text.BodyS>
      );
    }
    return (
      <View style={[styles.row, styles.footerButtonContainer]}>
        <View style={styles.row}>
          <Button.Danger
            testID="quiz_draft_view.button_delete"
            type="ghost"
            icon="TrashCan"
            onPress={onPressDelete}
          />
          <ViewSpacing width={16} />
          <Button.Secondary
            testID="quiz_draft_view.button_edit"
            type="ghost"
            icon="PenToSquare"
            onPress={onPressEdit}
          />
        </View>
        <Button.Primary
          testID="quiz_draft_view.button_publish"
          useI18n
          size="medium"
          loading={publishing}
          disabled={disableButtonPost}
          onPress={onCreateQuiz}
        >
          common:btn_publish
        </Button.Primary>
      </View>
    );
  };

  return (
    <View>
      <PostImportant
        isImportant={!!isImportant}
        expireTime={importantExpiredAt}
        markedReadPost={false}
        listCommunity={communities}
      />
      <View style={[styles.container, style]}>
        <PostHeader
          data={data}
          onPressHeader={onDoNothing}
        />
        <PostBody
          data={data}
          isPostDetail={false}
        />
        <View style={styles.divider}>
          <Divider color={colors.neutral5} />
        </View>
        {renderFooter()}
        <ViewSpacing height={8} />
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    row: {
      flexDirection: 'row',
    },
    footerButtonContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      justifyContent: 'space-between',
    },
    draftText: {
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
    },
    divider: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
  });
};

export default QuizPostView;
