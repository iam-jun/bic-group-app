import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { IPost } from '~/interfaces/IPost';
import { GenStatus, QuizStatus } from '~/interfaces/IQuiz';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import { fontFamilies } from '~/theme/fonts';
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

const QuizPostView: FC<QuizPostViewProps> = ({ data, style }) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  //   const actions = useDraftQuizStore((state) => state.actions);
  //   const modalActions = useModalStore((state) => state.actions);

  const {
    setting,
    communities,
    quiz,
  } = data || {};
  const { status, genStatus, id: quizId } = quiz || {};
  const { isImportant, importantExpiredAt } = setting || {};

  const disableButtonEdit = [
    GenStatus.FAILED,
    GenStatus.PROCESSING,
    GenStatus.PENDING,
  ].includes(genStatus);

  const disableButtonDelete = [
    GenStatus.PROCESSING,
    GenStatus.PENDING,
  ].includes(genStatus);

  const shouldNotRenderFooter = status === QuizStatus.PUBLISHED;

  // const refreshDraftQuiz = () => {
  //   actions.getDraftQuiz(true);
  // };

  const onPressEdit = () => {
    rootNavigation.navigate(
      quizStack.composeQuiz, {
        quizId,
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

  const renderLabelStatus = (
    label,
    color,
    isItalic,
  ) => (
    <View style={styles.genStatusContainer}>
      <Text.ParagraphS
        useI18n
        style={isItalic && styles.textItalic}
        color={color}
      >
        { label }
      </Text.ParagraphS>
    </View>
  );

  const renderGenStatus = () => {
    if (genStatus === GenStatus.FAILED) {
      return renderLabelStatus(
        'quiz:gen_status_quiz_process_fail',
        colors.red30,
        false,
      );
    }
    if (genStatus === GenStatus.PROCESSING) {
      return renderLabelStatus(
        'quiz:gen_status_quiz_processing',
        colors.neutral30,
        true,
      );
    }
    if (genStatus === GenStatus.PENDING) {
      return renderLabelStatus(
        'quiz:gen_status_quiz_waiting_process',
        colors.neutral30,
        true,
      );
    }

    return null;
  };

  const renderFooter = () => {
    if (shouldNotRenderFooter) return null;

    return (
      <View style={styles.footerContainer}>
        <Button.Danger
          testID="quiz_draft_view.button_delete"
          type="ghost"
          icon="TrashCan"
          onPress={onPressDelete}
          disabled={disableButtonDelete}
        />
        <ViewSpacing width={16} />
        <Button.Secondary
          testID="quiz_draft_view.button_edit"
          type="ghost"
          icon="PenToSquare"
          onPress={onPressEdit}
          disabled={disableButtonEdit}
        />
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
        {renderGenStatus()}
        <View style={styles.dividerContainer}>
          <Divider color={colors.neutral5} />
        </View>
        {renderFooter()}
        <ViewSpacing height={spacing.margin.small} />
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
    footerContainer: {
      flexDirection: 'row',
      paddingLeft: spacing.padding.large,
      paddingBottom: spacing.padding.large,
    },
    dividerContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.large,
    },
    genStatusContainer: {
      paddingLeft: spacing.padding.small,
      marginLeft: spacing.margin.large,
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.large,
    },
    textItalic: {
      fontFamily: fontFamilies.BeVietnamProLightItalic,
    },
  });
};

export default QuizPostView;
