import React, { useEffect, useMemo } from 'react';
import {
  View, StyleSheet, Keyboard,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty, isEqual } from 'lodash';
import { useDispatch } from 'react-redux';

import Header from '~/beinComponents/Header';
import SelectAudience from '~/components/SelectAudience';
import useSelectAudienceStore from '~/components/SelectAudience/store';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import useSeriesStore, { ISeriesState } from '../store';
import modalActions from '~/storeRedux/modal/actions';
import { CreationSeriesProps } from '~/interfaces/ISeries';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { getAudienceIdsFromAudienceObject } from '~/screens/articles/EditArticle/helper';

const ChooseSeriesAudience = ({ route }: CreationSeriesProps) => {
  const { isFirstStep, isEditAudience, initAudienceGroups = [] } = route?.params || {};

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const dispatch = useDispatch();

  const { rootNavigation } = useRootNavigation();

  const seriesActions = useSeriesStore((state: ISeriesState) => state.actions);
  const { loading } = useSeriesStore((state: ISeriesState) => state);

  const selectingAudienceIds = useSelectAudienceStore((state) => state.selectingIds);
  const selectAudienceResetStore = useSelectAudienceStore((state) => state.reset);
  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);
  const selectingAudienceGroups = useSelectAudienceStore((state) => state.selecting.groups);

  const setInitDataToSelectingAudiences = () => {
    const newSelectingGroups = {};
    initAudienceGroups?.forEach((group) => {
      newSelectingGroups[group?.id] = group;
    });
    selectAudienceActions.setSelectingGroups(newSelectingGroups);
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
      dispatch(modalActions.showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => {
          setInitDataToSelectingAudiences();
          rootNavigation.goBack();
        },
      }));
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
        dispatch(modalActions.showAlert({
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
        }));
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
      <SelectAudience />
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
