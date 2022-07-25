import useNotifications from '~/hooks/notifications';

const useTabBadge = () => {
  const { unseenNumber } = useNotifications();
  return {
    notification: unseenNumber,
  };
};

export default useTabBadge;
