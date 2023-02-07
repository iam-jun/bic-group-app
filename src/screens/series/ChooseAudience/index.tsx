import React, { useEffect, useMemo } from 'react';
import {
  View, StyleSheet, Keyboard,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty, isEqual } from 'lodash';

import Header from '~/beinComponents/Header';
import SelectAudience, { ContentType } from '~/components/SelectAudience';
import useSelectAudienceStore from '~/components/SelectAudience/store';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { CreationSeriesProps } from '~/interfaces/ISeries';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { getAudienceIdsFromAudienceObject } from '~/screens/articles/CreateArticle/helper';
import useSeriesStore, { ISeriesState } from '../store';
import useModalStore from '~/store/modal';

const ChooseSeriesAudience = ({ route }: CreationSeriesProps) => {
  const { isFirstStep, isEditAudience, initAudienceGroups = [] } = route?.params || {};

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { showAlert } = useModalStore((state) => state.actions);

  const { rootNavigation } = useRootNavigation();

  const seriesActions = useSeriesStore((state: ISeriesState) => state.actions);
  const { loading } = useSeriesStore((state: ISeriesState) => state);

  const selectingAudienceIds = useSelectAudienceStore((state) => state.selectedIds);
  const selectingAudienceGroups = useSelectAudienceStore((state) => state.selectedAudiences.groups);
  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);
  const selectAudienceResetStore = useSelectAudienceStore((state) => state.reset);

  const setInitDataToSelectingAudiences = () => {
    const newSelectingGroups = {};
    initAudienceGroups?.forEach((group) => {
      newSelectingGroups[group?.id] = group;
    });
    selectAudienceActions.setSelectedAudiences(newSelectingGroups);
  };

  useEffect(() => {
    if (initAudienceGroups?.length > 0) {
      setInitDataToSelectingAudiences();
    }
  }, [initAudienceGroups]);

  useEffect(() => {
    if (isFirstStep) selectAudienceResetStore();
  }, []);

  const initAudienceIds = useMemo(
    () => getAudienceIdsFromAudienceObject({ groups: initAudienceGroups }), [initAudienceGroups],
  );

  const isAudienceUpdated = !isEqual(initAudienceIds, selectingAudienceIds);
  const isAudienceSelected = !(isEmpty(selectingAudienceIds?.groupIds) && isEmpty(selectingAudienceIds?.userIds));

  const disabled = !(isAudienceUpdated && isAudienceSelected) || loading;

  const handleBack = () => {
    if (!disabled || isAudienceUpdated) {
      Keyboard.dismiss();
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => {
          setInitDataToSelectingAudiences();
          rootNavigation.goBack();
        },
      });
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(handleBack);

  const handleSave = () => {
    if (isFirstStep) {
      seriesActions.setAudience(selectingAudienceIds);
      seriesActions.setAudienceGroups(selectingAudienceGroups);
      rootNavigation.replace(
        seriesStack.createSeries,
      );
    } else if (isEditAudience) {
      if (isAudienceUpdated) {
        showAlert({
          title: t('post:create_post:title_audience_changed'),
          content: t('post:create_post:text_discard_change_audience'),
          cancelBtn: true,
          cancelLabel: t('common:btn_discard'),
          confirmLabel: t('post:create_post:btn_save_change'),
          onConfirm: () => {
            seriesActions.setAudience(selectingAudienceIds);
            seriesActions.setAudienceGroups(selectingAudienceGroups);
            rootNavigation.goBack();
          },
        });
      } else {
        seriesActions.setAudience(selectingAudienceIds);
        seriesActions.setAudienceGroups(selectingAudienceGroups);
        rootNavigation.goBack();
      }
    } else {
      seriesActions.setAudience(selectingAudienceIds);
      seriesActions.setAudienceGroups(selectingAudienceGroups);
      rootNavigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('post:title_post_to')}
        buttonProps={{
          disabled,
          loading,
          testID: 'series_select_audience.btn_next',
        }}
        buttonText={t('common:btn_next')}
        onPressButton={handleSave}
        onPressBack={handleBack}
      />
      <SelectAudience contentType={ContentType.SERIES} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
  });
};

export default ChooseSeriesAudience;
