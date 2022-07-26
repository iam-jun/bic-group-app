import { useSelector } from 'react-redux';
import { IObject } from '~/interfaces/common';

const useNotifications = () => {
  const notifications = useSelector(
    (state: IObject<any>) => state.notifications,
  );
  return notifications;
};

export default useNotifications;
