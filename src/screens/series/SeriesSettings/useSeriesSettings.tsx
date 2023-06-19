import { useEffect, useState } from 'react';
import { IActivityImportant, IPostSetting, IPutEditSettingsParams } from '~/interfaces/IPost';
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
import usePostsStore from '~/store/entities/posts';

export interface IUseSeriesSettings {
    seriesId?: string;
}

const useSeriesSettings = (params?: IUseSeriesSettings) => {
  const { seriesId } = params || {};

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const postsStoreActions = usePostsStore((state) => state.actions);

  const {
    audiencesWithNoPermission: listAudiencesWithoutPermission,
  } = useSeriesCreation({ seriesId });

  const [loading, setLoading] = useState(false);
  const { setting } = useSeriesStore((state) => state.data);
  const {
    isImportant, importantExpiredAt, canReact, canComment,
  } = setting || {};
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

  const updateStore = () => {
    actions.setSettings({
      isImportant: sImportant.active,
      importantExpiredAt: sImportant.expiresTime,
      canReact,
      canComment,
    });
  };

  const editSettingsOnExistedSeries = () => {
    const newSetting: IPostSetting = {
      isImportant: sImportant.active,
      importantExpiredAt: sImportant.expiresTime,
      canReact,
      canComment,
    };

    const onPreLoad = () => {
      setLoading(true);
    };

    const onSuccess = () => {
      setLoading(false);
      updateStore();
      actions.getSeriesDetail(seriesId);
      rootNavigation.goBack();
    };

    const onFailed = () => {
      setLoading(false);
    };

    const params: IPutEditSettingsParams = {
      id: seriesId,
      setting: newSetting,
      onPreLoad,
      onSuccess,
      onFailed,
    };
    postsStoreActions.putEditSettings(params);
  };

  const handleSaveSettings = () => {
    // update settings on editing series, or from menu edit settings
    if (seriesId) {
      editSettingsOnExistedSeries();
    } else {
      // update settings on creating series
      updateStore();
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
