import React, { useEffect, useRef } from 'react';
import {
  StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import ChosenAudiences from './components/ChosenAudiences';
import CoverImage from './components/CoverImage';
import { TextArea, TextInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import useSeriesCreation from '../hooks/useSeriesCreation';
import { CreationSeriesProps } from '~/interfaces/ISeries';
import useSeriesStore, { ISeriesState } from '../store';
import { IAudienceGroup } from '~/interfaces/IPost';
import modalActions from '~/storeRedux/modal/actions';
import AlertDeleteAudiencesConfirmContent from '~/components/posts/AlertDeleteAudiences';

const CreateSeries = ({ route }: CreationSeriesProps) => {
  const { seriesId, isFromDetail } = route?.params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const dispatch = useDispatch();

  const scrollRef = useRef<any>(null);

  const resetStore = useSeriesStore((state:ISeriesState) => state.reset);

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
    dispatch(
      modalActions.showAlert({
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
      }),
    );
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
      />
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
            placeholder={t('common:text_input_description')}
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
  });
};
export default CreateSeries;
