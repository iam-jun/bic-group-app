import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import {
  View, StyleSheet, Modal, Platform,
} from 'react-native';
import moment from 'moment';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import Icon from '~/baseComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { DateInput } from '~/baseComponents/Input';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import { Button } from '~/baseComponents';
import useModalStore from '~/store/modal';
import { PostType } from '~/interfaces/IPost';
import useCreatePostStore from '~/screens/post/CreatePost/store';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

type ScheduleModalProps = {
  contentId: string;
  contentType: PostType;
  isPostScheduled?: boolean;
  handleSchedule: () => void;
  doAfterScheduleSuccess: (isReplace?: boolean) => void;
  setDateSchedule: (date: string) => void;
  setTimeSchedule: (time: string) => void;
};

const ScheduleModal: FC<ScheduleModalProps> = ({
  contentId,
  contentType,
  isPostScheduled = false,
  handleSchedule,
  doAfterScheduleSuccess,
  setDateSchedule,
  setTimeSchedule,
}) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const contentData = usePostsStore(postsSelector.getPost(contentId, {}));
  const {
    scheduledAt: scheduledAtArticle,
    isSubmiting: isSubmitingArticle,
    isSubmitingSuccess: isSubmitingSuccessArticle,
    errorSubmiting: errorSubmitingArticle,
  } = useCreateArticleStore((state) => state.schedule);
  const {
    scheduledAt: scheduledAtPost,
    isSubmiting: isSubmitingPost,
    isSubmitingSuccess: isSubmitingSuccessPost,
    errorSubmiting: errorSubmitingPost,
  } = useCreatePostStore((state) => state.schedule);
  const modalActions = useModalStore((state) => state.actions);

  const scheduledAt
    = contentType === PostType.ARTICLE ? scheduledAtArticle : scheduledAtPost;
  const isSubmiting
    = contentType === PostType.ARTICLE ? isSubmitingArticle : isSubmitingPost;
  const isSubmitingSuccess
    = contentType === PostType.ARTICLE ? isSubmitingSuccessArticle : isSubmitingSuccessPost;
  const errorSubmiting
    = contentType === PostType.ARTICLE ? errorSubmitingArticle : errorSubmitingPost;

  const [isSetTime, setIsSetTime] = useState(!!scheduledAt);
  const [isSetDate, setIsSetDate] = useState(!!scheduledAt);

  const hasResultSchedule
    = isSubmitingSuccess || !!errorSubmiting;
  const isDataChanged = scheduledAt !== contentData?.scheduledAt;
  const disableBtnSchedule = !(isSetDate && isSetTime) || isSubmiting || !isDataChanged;

  const onScheduleSubmitingSuccess = () => {
    setTimeout(() => {
      closeModal();
      if (isPostScheduled) {
        doAfterScheduleSuccess(false);
      } else {
        doAfterScheduleSuccess();
      }
    }, 3000);
  };

  useEffect(() => {
    if (isSubmitingSuccess) {
      onScheduleSubmitingSuccess();
    }
  }, [isSubmitingSuccess]);

  const closeModal = () => {
    modalActions.hideModal();
  };

  const getMinDateTime = () => {
    const now = moment();
    const extraTime = 30 - (now.minute() % 30);
    const remainder = 30 + extraTime;
    now.add(remainder, 'minutes').second(0).millisecond(0);

    return new Date(now.toISOString());
  };

  const minDateTime = getMinDateTime();

  const isValidTime = (time: Date) => moment(time).isSameOrAfter(minDateTime);

  const handleChangeDatePicker = (datetime?: Date) => {
    setIsSetDate(true);
    const selectedDate = moment(datetime || minDateTime);
    const newScheduledAt = moment(scheduledAt || minDateTime)
      .year(selectedDate.year())
      .month(selectedDate.month())
      .date(selectedDate.date());
    setDateSchedule(newScheduledAt.toISOString());
  };

  const handleChangeTimePicker = (datetime?: Date) => {
    let pickedTime = datetime;
    // on Android, timepicker doesn't support min time,
    // so we need to recheck valid selected time here
    if (Platform.OS === 'android' && !isValidTime(datetime)) {
      pickedTime = new Date(scheduledAt || minDateTime);
    }
    setIsSetTime(true);
    const selectedTime = moment(pickedTime || minDateTime);
    const newScheduledAt = moment(scheduledAt || minDateTime)
      .hour(selectedTime.hour())
      .minute(selectedTime.minute())
      .second(0)
      .millisecond(0);
    setTimeSchedule(newScheduledAt.toISOString());
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
    <>
      <View style={styles.notedView}>
        <Text.BodyM useI18n color={colors.neutral40}>
          post:text_noted_schedule
        </Text.BodyM>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.datetimeContainer}>
          <DateInput
            mode="date"
            value={scheduledAt || minDateTime.toISOString()}
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
            value={scheduledAt || minDateTime.toISOString()}
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
    </>
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
    notedView: {
      paddingHorizontal: spacing.padding.extraLarge,
      paddingVertical: spacing.padding.small,
      backgroundColor: colors.neutral2,
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
