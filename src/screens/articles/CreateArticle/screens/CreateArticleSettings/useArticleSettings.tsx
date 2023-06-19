import { useEffect, useState } from 'react';
import { IActivityImportant, IPostSetting, IPutEditSettingsParams } from '~/interfaces/IPost';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import {
  getMinDateImportant as getMinDate,
  getMaxDateImportant as getMaxDate,
  handleChangeDatePickerImportant,
  handleChangeTimePickerImportant,
  handleChangeSuggestDateImportant,
  toggleImportant,
} from '~/helpers/settingImportant';
import useCreateArticle from '../../hooks/useCreateArticle';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import showAlert from '~/store/helper/showAlert';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';
import usePostsStore from '~/store/entities/posts';

export interface IUseArticleSettings {
  articleId?: string;
}

const useArticleSettings = (params?: IUseArticleSettings) => {
  const { articleId } = params || {};

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const {
    audiencesWithNoPermission: listAudiencesWithoutPermission,
  } = useCreateArticle({ articleId });

  const postsStoreActions = usePostsStore((state) => state.actions);

  const { setting } = useCreateArticleStore((state) => state.data);
  const chooseAudiences = useCreateArticleStore((state) => state.chooseAudiences);
  const {
    isImportant, importantExpiredAt, canComment, canReact,
  } = setting || {};
  const articlesStoreActions = useArticlesStore((state) => state.actions);

  const [loading, setLoading] = useState(false);
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

  const editSettingsOnExistedArticle = () => {
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
      articlesStoreActions.getArticleDetail({ articleId });
      rootNavigation.goBack();
    };

    const onFailed = () => {
      setLoading(false);
    };

    const params: IPutEditSettingsParams = {
      id: articleId,
      setting: newSetting,
      audiences: chooseAudiences,
      onPreLoad,
      onSuccess,
      onFailed,
    };
    postsStoreActions.putEditSettings(params);
  };

  const handleSaveSettings = () => {
    if (articleId) {
      editSettingsOnExistedArticle();
    }
  };

  // useEffect(() => {
  //   actions.setSettings({
  //     isImportant: sImportant.active,
  //     importantExpiredAt: sImportant.expiresTime,
  //   });
  // }, [sImportant]);

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
    getMinDate,
    getMaxDate,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handleChangeSuggestDate,
    handleSaveSettings,
    disableButtonSave,
    loading,
    handleBack,
  };
};

export default useArticleSettings;
