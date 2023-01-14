import useModalStore from '../modal';
import { IAlertModal } from '~/interfaces/common';

const showAlert = (payload: IAlertModal) => {
  useModalStore.getState().actions.showAlert(payload);
};

export default showAlert;
