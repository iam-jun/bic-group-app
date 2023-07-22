import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { useBaseHook } from '~/hooks';
import { IPost } from '~/interfaces/IPost';
import { GenStatus, QuizStatus } from '~/interfaces/IQuiz';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import { fontFamilies } from '~/theme/fonts';
import { Button } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Divider from '~/beinComponents/Divider';
import useModalStore from '~/store/modal';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';

interface DraftQuizFooterProps {
  data: IPost;
  style?: StyleProp<ViewStyle>;
}

const DraftQuizFooter: React.FC<DraftQuizFooterProps> = ({
  data,
  style,
}) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const modalActions = useModalStore((state) => state.actions);

  const { quiz } = data || {};
  const { status, genStatus, id: quizId } = quiz || {};

  const disableButtonEdit = [
    GenStatus.FAILED,
    GenStatus.PROCESSING,
    GenStatus.PENDING,
  ].includes(genStatus);

  const disableButtonDelete = [
    GenStatus.PROCESSING,
    GenStatus.PENDING,
  ].includes(genStatus);

  const shouldNotRender = status === QuizStatus.PUBLISHED;

  const onPressEdit = () => {
    rootNavigation.navigate(
      quizStack.composeQuiz, {
        quizId,
      },
    );
  };

  const onDelete = () => {

  };

  const onPressDelete = () => {
    modalActions.showAlert({
      title: t('post:title_delete_quiz'),
      content: t('post:content_delete_quiz'),
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      confirmLabel: t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: onDelete,
    });
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

  const renderDivider = () => (
    <View style={styles.dividerContainer}>
      <Divider color={colors.neutral5} />
    </View>
  );


  const renderOptionButtons = () => (
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

  if (shouldNotRender) {
    return (
      <ViewSpacing height={spacing.margin.large} />
    )
  }

  return (
    <View style={[styles.container, style]}>
      {renderGenStatus()}
      {renderDivider()}
      {renderOptionButtons()}
      <ViewSpacing height={spacing.margin.small} />
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

export default DraftQuizFooter;
