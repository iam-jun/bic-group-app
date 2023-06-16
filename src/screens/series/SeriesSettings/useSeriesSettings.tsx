import { useEffect, useState } from 'react';
import { IActivityImportant } from '~/interfaces/IPost';
import useSeriesStore from '../store';
import {
  getMinDateImportant as getMinDate,
  getMaxDateImportant as getMaxDate,
  handleChangeDatePickerImportant,
  handleChangeTimePickerImportant,
  handleChangeSuggestDateImportant,
  toggleImportant,
} from '~/helpers/settingImportant';
import { useRootNavigation } from '~/hooks/navigation';
import useSeriesCreation from '../hooks/useSeriesCreation';
import showAlert from '~/store/helper/showAlert';
import { useBaseHook } from '~/hooks';

export interface IUseSeriesSettings {
    seriesId?: string;
}

const useSeriesSettings = (params?: IUseSeriesSettings) => {
  const { seriesId } = params || {};

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const {
    audiencesWithNoPermission: listAudiencesWithoutPermission,
  } = useSeriesCreation({ seriesId });

  const loading = useSeriesStore((state) => state.loading);
  const { setting } = useSeriesStore((state) => state.data);
  const { isImportant, importantExpiredAt } = setting || {};
  const actions = useSeriesStore((state) => state.actions);

  const [disableButtonSave, setDisableButtonSave] = useState<boolean>(true);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [showCustomExpire, setCustomExpire] = useState<boolean>(false);
  const [sImportant, setImportant] = useState<IActivityImportant>({
    active: isImportant || false,
    expiresTime: importantExpiredAt || null,
    chosenSuggestedTime: '',
    neverExpires: isImportant && !importantExpiredAt,
  });
  const isImportantChanged = isImportant !== sImportant.active || importantExpiredAt !== sImportant.expiresTime;

  useEffect(() => {
    if (isImportantChanged) {
      setImportant({
        ...sImportant,
        active: isImportant,
        expiresTime: importantExpiredAt,
        neverExpires: isImportant && !importantExpiredAt,
      });
    }
  }, [isImportant, importantExpiredAt]);

  useEffect(() => {
    setDisableButtonSave(!isImportantChanged);
  }, [sImportant]);

  const handleSaveSettings = () => {
    // update setting on editing series
    if (seriesId) {
      // do something
    } else {
      // update setting on creating series
      actions.setSettings({
        isImportant: sImportant.active,
        importantExpiredAt: sImportant.expiresTime,
      });
      rootNavigation.goBack();
    }
  };

  const handleToggleImportant = () => {
    toggleImportant(
      listAudiencesWithoutPermission,
      sImportant,
      setImportant,
      setShowWarning,
    );
  };

  const handleChangeDatePicker = (date?: Date) => {
    handleChangeDatePickerImportant(
      date,
      sImportant,
      setImportant,
    );
  };

  const handleChangeTimePicker = (time?: Date) => {
    handleChangeTimePickerImportant(
      time,
      sImportant,
      setImportant,
    );
  };

  const handleChangeSuggestDate = (chooseDate: any) => {
    handleChangeSuggestDateImportant(
      chooseDate,
      sImportant,
      setImportant,
      setCustomExpire,
    );
  };

  const handleBack = () => {
    if (disableButtonSave) {
      rootNavigation.goBack();
    } else {
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      });
    }
  };

  return {
    sImportant,
    showWarning,
    showCustomExpire,
    disableButtonSave,
    loading,
    getMinDate,
    getMaxDate,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handleChangeSuggestDate,
    handleSaveSettings,
    handleBack,
  };
};

export default useSeriesSettings;
