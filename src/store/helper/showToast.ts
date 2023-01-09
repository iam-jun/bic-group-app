import useModalStore from '../modal';
import { IToastMessage } from '~/interfaces/common';

const showToast = (payload: IToastMessage) => {
  useModalStore.getState().actions.showToast(payload);
};

export default showToast;
