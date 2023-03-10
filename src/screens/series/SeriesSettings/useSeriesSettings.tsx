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

export interface IUseSeriesSettings {
    seriesId?: string;
    listAudiencesWithoutPermission?: any[];
}

const useSeriesSettings = (params?: IUseSeriesSettings) => {
  const { listAudiencesWithoutPermission } = params || {};

  const { rootNavigation } = useRootNavigation();

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
    actions.setSettings({
      isImportant: sImportant.active,
      importantExpiredAt: sImportant.expiresTime,
    });
    rootNavigation.goBack();
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

  return {
    sImportant,
    showWarning,
    showCustomExpire,
    disableButtonSave,
    getMinDate,
    getMaxDate,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handleChangeSuggestDate,
    handleSaveSettings,
  };
};

export default useSeriesSettings;
