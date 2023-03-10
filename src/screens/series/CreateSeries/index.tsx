import React, { useEffect, useRef } from 'react';
import {
  StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import ChosenAudiences from './components/ChosenAudiences';
import CoverImage from './components/CoverImage';
import { TextArea, TextInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import SettingsButton from '~/components/ImportantSettings/SettingsButton';
import useSeriesCreation from '../hooks/useSeriesCreation';
import { CreationSeriesProps } from '~/interfaces/ISeries';
import useSeriesStore, { ISeriesState } from '../store';
import { IAudienceGroup, PostType } from '~/interfaces/IPost';
import AlertDeleteAudiencesConfirmContent from '~/components/posts/AlertDeleteAudiences';
import CreateBannerImportant from '~/components/ImportantSettings/CreateBannerImportant';
import useModalStore from '~/store/modal';

const CreateSeries = ({ route }: CreationSeriesProps) => {
  const { seriesId, isFromDetail } = route?.params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const { showAlert } = useModalStore((state) => state.actions);

  const scrollRef = useRef<any>(null);

  const seriesData = useSeriesStore((state: ISeriesState) => state.data);
  const resetStore = useSeriesStore((state:ISeriesState) => state.reset);
  const { setting } = seriesData || {};

  useEffect(() => () => { resetStore(); }, []);

  const handleEditAudienceError = (listIdAudiences: string[], groupsAudience: any[]) => {
    if (listIdAudiences?.length <= 0 || groupsAudience?.length <= 0) {
      return;
    }

    const listAudiences = listIdAudiences.map((audienceId) => {
      const _audience = groupsAudience.find(
        (audience: IAudienceGroup) => audience?.id === audienceId,
      );
      return _audience;
    });
    showAlert({
      title: t('series:title_edit_audience_failed'),
      children: (
        <AlertDeleteAudiencesConfirmContent
          data={listAudiences}
          textContent={t('series:content_edit_audience_failed')}
        />
      ),
      cancelBtn: true,
      cancelLabel: t('common:btn_close'),
      onConfirm: null,
    });
  };

  const {
    loading,
    audience,
    title,
    summary,
    coverMedia,
    disableButtonSave,
    handleSave,
    handleBack,
    handleTitleChange,
    handleSummaryChange,
    handleUploadCoverSuccess,
    handlePressAudiences,
  } = useSeriesCreation({ seriesId, isFromDetail, handleEditAudienceError });

  const onFoucusInput = () => {
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        scrollRef.current.scrollToEnd();
      }, 250);
    }
  };

  const renderSettingsButton = () => (<SettingsButton type={PostType.SERIES} seriesId={seriesId} />);

  const renderImportantLabel = () => {
    if (!setting?.isImportant) return null;

    return (
      <CreateBannerImportant
        expiresTime={setting.importantExpiredAt}
        style={styles.bannerImportantTime}
      />
    );
  };

  return (
    <ScreenWrapper isFullView testID="create_series_screen">
      <Header
        titleTextProps={{ useI18n: true }}
        title={`series:title:${seriesId ? 'edit' : 'create'}`}
        buttonText="common:btn_publish"
        buttonProps={{
          loading,
          disabled: disableButtonSave,
          useI18n: true,
          style: { borderWidth: 0 },
          testID: 'create_series.btn_publish',
        }}
        onPressBack={handleBack}
        onPressButton={handleSave}
        renderCustomComponent={renderSettingsButton}
      />
      {renderImportantLabel()}
      <ChosenAudiences
        audiences={audience}
        disabled={loading}
        onPressAudiences={handlePressAudiences}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
        style={styles.flex1}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.flex1}
          contentContainerStyle={{ paddingBottom: spacing.padding.large }}
          ref={scrollRef}
        >
          <CoverImage
            style={styles.coverImage}
            disabled={loading}
            coverMedia={coverMedia}
            onUploadSuccess={handleUploadCoverSuccess}
          />
          <Text.LabelM useI18n style={[styles.title, styles.label]}>
            series:title_name
          </Text.LabelM>
          <TextInput
            value={title}
            placeholder={t('series:text_input_name')}
            maxLength={64}
            style={styles.title}
            onChangeText={handleTitleChange}
            onFocus={onFoucusInput}
          />
          <Text.LabelM style={[styles.title, styles.label]}>
            {t('common:text_description')}
            {' '}
            <Text.LabelM color={theme.colors.neutral20}>
              (
              {t('common:text_optional')}
              )
            </Text.LabelM>
          </Text.LabelM>
          <TextArea
            testID="create_series.description"
            value={summary}
            maxLength={255}
            placeholder={t('common:text_input_summary')}
            style={styles.summary}
            inputStyle={styles.textInput}
            onChangeText={handleSummaryChange}
            onFocus={onFoucusInput}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    flex1: { flex: 1, backgroundColor: colors.white },
    container: {
      flex: 1,
    },
    coverImage: {
      marginTop: spacing.margin.big,
    },
    label: {
      marginTop: spacing.margin.large,
    },
    title: {
      marginHorizontal: spacing.margin.large,
    },
    summary: {
      paddingTop: spacing.padding.small,
    },
    textInput: {
      paddingVertical: 0,
      marginTop: 0,
    },
    bannerImportantTime: {
      backgroundColor: colors.white,
      paddingBottom: spacing.padding.large,
    },
  });
};
export default CreateSeries;
