import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import {
  View, StyleSheet, Modal, Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import useCreateArticle from '../hooks/useCreateArticle';
import useArticlesStore from '../../ArticleDetail/store';
import Icon from '~/baseComponents/Icon';
import modalActions from '~/storeRedux/modal/actions';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { DateInput } from '~/baseComponents/Input';
import useCreateArticleStore from '../store';
import { Button } from '~/baseComponents';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

type ScheduleModalProps = {
  articleId: string;
  isFromReviewSchedule?: boolean;
};

const ScheduleModal: FC<ScheduleModalProps> = ({
  articleId,
  isFromReviewSchedule = false,
}) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const articlesActions = useArticlesStore((state) => state.actions);

  const { handleSchedule } = useCreateArticle({
    articleId,
  });

  const actions = useCreateArticleStore((state) => state.actions);
  const {
    publishedAt, isSubmiting, isSubmitingSuccess, errorSubmiting,
  } = useCreateArticleStore((state) => state.schedule);

  const [isSetTime, setIsSetTime] = useState(!!publishedAt);
  const [isSetDate, setIsSetDate] = useState(!!publishedAt);

  const hasResultSchedule
    = isSubmitingSuccess || !!errorSubmiting;
  const disableBtnSchedule = !(isSetDate && isSetTime) || isSubmiting;

  const onScheduleSubmitingSuccess = () => {
    setTimeout(() => {
      closeModal();
      if (isFromReviewSchedule) {
        articlesActions.getArticleDetail({ articleId });
      } else {
        rootNavigation.replace(articleStack.articleReviewSchedule, { articleId });
      }
    }, 5000);
  };

  useEffect(() => {
    if (isSubmitingSuccess) {
      onScheduleSubmitingSuccess();
    }
  }, [isSubmitingSuccess]);

  const closeModal = () => {
    dispatch(modalActions.hideModal());
  };

  const getMinDateTime = () => {
    const now = moment();
    const remainder = 30 - (now.minute() % 30);
    now.add(remainder, 'minutes').second(0).millisecond(0);
    return new Date(now.toISOString());
  };

  const minDateTime = getMinDateTime();

  const isValidTime = (time: Date) => moment(time).isSameOrAfter(minDateTime);

  const handleChangeDatePicker = (datetime?: Date) => {
    setIsSetDate(true);
    const selectedDate = moment(datetime || minDateTime);
    const newPublishedAt = moment(publishedAt || minDateTime)
      .year(selectedDate.year())
      .month(selectedDate.month())
      .date(selectedDate.date());
    actions.setPublishedAt(newPublishedAt.toISOString());
  };

  const handleChangeTimePicker = (datetime?: Date) => {
    let pickedTime = datetime;
    // on Android, timepicker doesn't support min time,
    // so we need to recheck valid selected time here
    if (Platform.OS === 'android' && !isValidTime(datetime)) {
      pickedTime = new Date(publishedAt || minDateTime);
    }
    setIsSetTime(true);
    const selectedTime = moment(pickedTime || minDateTime);
    const newPublishedAt = moment(publishedAt || minDateTime)
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .second(0)
      .millisecond(0);
    actions.setPublishedAt(newPublishedAt.toISOString());
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text.H4 useI18n>article:article_schedule_title</Text.H4>
      <Icon
        size={18}
        tintColor={colors.neutral40}
        icon="Xmark"
        onPress={closeModal}
      />
    </View>
  );

  const renderContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.datetimeContainer}>
        <DateInput
          mode="date"
          value={publishedAt || minDateTime.toISOString()}
          minDate={minDateTime}
          label={t('common:text_date')}
          onConfirm={handleChangeDatePicker}
          style={styles.flex1}
          keepPlaceholder={!isSetDate}
          minuteInterval={30}
        />
        <ViewSpacing width={16} />
        <DateInput
          mode="time"
          value={publishedAt || minDateTime.toISOString()}
          minDate={minDateTime}
          label={t('common:text_time')}
          onConfirm={handleChangeTimePicker}
          style={styles.flex1}
          keepPlaceholder={!isSetTime}
          minuteInterval={30}
        />
      </View>
      <ViewSpacing height={spacing.margin.large} />
      <Button.Primary
        useI18n
        disabled={disableBtnSchedule}
        loading={isSubmiting}
        onPress={handleSchedule}
      >
        article:text_schedule
      </Button.Primary>
    </View>
  );

  const renderResultError = () => (
    <View style={[styles.flex1, styles.resultMessage]}>
      <Icon icon="CircleExclamation" size={38} tintColor={colors.red40} />
      <ViewSpacing height={spacing.margin.large} />
      <Text.ParagraphL color={colors.neutral80} style={styles.textCenter}>
        {errorSubmiting}
      </Text.ParagraphL>
    </View>
  );

  const renderResultSuccess = () => (
    <>
      {/* we use a modal here for preventing dismiss the current modal */}
      <Modal transparent />
      <View style={[styles.flex1, styles.resultMessage]}>
        <Icon icon="CircleCheck" size={38} tintColor={colors.green50} />
        <ViewSpacing height={spacing.margin.large} />
        <Text.ParagraphL useI18n color={colors.neutral80}>
          article:successful_schedule
        </Text.ParagraphL>
      </View>
    </>
  );

  const renderResult = () => (
    <View style={[styles.resultContainer]}>
      {!!errorSubmiting && renderResultError()}
      {isSubmitingSuccess && renderResultSuccess()}
    </View>
  );

  return (
    <View testID="schedule_modal">
      {!hasResultSchedule && (
        <ViewSpacing height={spacing.padding.extraLarge} />
      )}
      {renderHeader()}
      {renderContent()}
      {hasResultSchedule && renderResult()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    headerContainer: {
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral5,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    contentContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.big,
    },
    datetimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    flex1: { flex: 1 },
    resultContainer: {
      backgroundColor: colors.white,
      borderTopRightRadius: spacing.borderRadius.extraLarge,
      borderTopLeftRadius: spacing.borderRadius.extraLarge,
      ...StyleSheet.absoluteFillObject,
    },
    resultMessage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    textCenter: {
      textAlign: 'center',
    },
  });
};

export default ScheduleModal;
