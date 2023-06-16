import streamApi from '~/api/StreamApi';
import { IPutEditSettingsParams } from '~/interfaces/IPost';
import showToastSuccess from '~/store/helper/showToastSuccess';

const putEditSettings = (_set, _get) => async (params: IPutEditSettingsParams) => {
  const {
    id, setting, onPreLoad, onSuccess, onFailed,
  } = params;

  try {
    if (!id) return;

    onPreLoad?.();

    const data = {
      id,
      setting,
    };
    const res = await streamApi.putEditSettings(data);

    onSuccess?.();
    showToastSuccess(res);
  } catch (error) {
    console.error('putEditSettings', error);
    onFailed?.(error);
  }
};

export default putEditSettings;
