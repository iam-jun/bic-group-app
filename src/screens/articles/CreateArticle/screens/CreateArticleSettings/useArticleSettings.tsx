import { useEffect, useState } from 'react';
import { IActivityImportant } from '~/interfaces/IPost';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import {
  getMinDateImportant as getMinDate,
  getMaxDateImportant as getMaxDate,
  handleChangeDatePickerImportant,
  handleChangeTimePickerImportant,
  handleChangeSuggestDateImportant,
  toggleImportant,
} from '~/helpers/settingImportant';

export interface IUseArticleSettings {
  articleId?: string;
  listAudiencesWithoutPermission?: any[];
}

const useArticleSettings = (params?: IUseArticleSettings) => {
  const { listAudiencesWithoutPermission } = params || {};

  const { setting } = useCreateArticleStore((state) => state.data);
  const { isImportant, importantExpiredAt } = setting || {};
  const actions = useCreateArticleStore((state) => state.actions);

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [showCustomExpire, setCustomExpire] = useState<boolean>(false);
  const [sImportant, setImportant] = useState<IActivityImportant>({
    active: isImportant || false,
    expiresTime: importantExpiredAt || null,
    chosenSuggestedTime: '',
    neverExpires: isImportant && !importantExpiredAt,
  });

  useEffect(() => {
    const isImportantChanged = isImportant !== sImportant.active || importantExpiredAt !== sImportant.expiresTime;

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
    actions.setSettings({
      isImportant: sImportant.active,
      importantExpiredAt: sImportant.expiresTime,
    });
  }, [sImportant]);

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
    getMinDate,
    getMaxDate,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handleChangeSuggestDate,
  };
};

export default useArticleSettings;
