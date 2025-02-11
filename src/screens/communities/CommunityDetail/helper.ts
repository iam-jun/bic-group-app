import i18next from 'i18next';

interface IGetHeaderMenuParams {
  type: 'community' | 'group';
  isMember: boolean;
  canSetting: boolean;
  onPressAdminTools?: () => void;
  onPressCopyLink?: () => void;
  onPressShare?: () => void;
  onPressFollowing?: () => void;
  onPressPin?: () => void;
  onPressNotification?: () => void;
  onPressLeave?: () => void
}

export const getHeaderMenu = ({
  type,
  isMember,
  canSetting,
  onPressAdminTools,
  onPressCopyLink,
  onPressLeave,
}: IGetHeaderMenuParams) => {
  const defaultData = [{
    id: 1,
    testID: 'header_menu.admin_tools',
    leftIcon: 'iconShieldStar',
    title: i18next.t('groups:group_menu:label_admin_tools'),
    requireCanSetting: true,
    onPress: onPressAdminTools,
  },
  {
    id: 2,
    testID: 'header_menu.copy_link',
    leftIcon: 'LinkHorizontal',
    title: i18next.t('groups:group_menu:label_copy_group_link'),
    onPress: onPressCopyLink,
  },
  // {
  //   id: 3,
  //   testID: `header_menu.share_${type}`,
  //   leftIcon: 'Share',
  //   title: i18next.t('groups:group_menu:label_share_group'),
  //   onPress: !!onPressShare ? onPressShare : onPressNewFeature,
  // },
  // {
  //   id: 4,
  //   testID: 'header_menu.following',
  //   leftIcon: 'RSS',
  //   title: i18next.t('groups:group_menu:label_following'),
  //   onPress: !!onPressFollowing ? onPressFollowing : onPressNewFeature,
  // },
  // {
  //   id: 5,
  //   testID: `header_menu.pin_${type}`,
  //   leftIcon: 'Thumbtack',
  //   title: i18next.t(`groups:group_menu:label_pin_${type}`),
  //   onPress: !!onPressPin ? onPressPin : onPressNewFeature,
  // },
  // {
  //   id: 6,
  //   testID: 'header_menu.go_back_home',
  //   leftIcon: 'House',
  //   title: i18next.t('groups:group_menu:label_go_back_home'),
  //   onPress: !!onPressNotification ? onPressNotification : onPressNewFeature,
  // },
  {
    id: 7,
    testID: `header_menu.leave_${type}`,
    leftIcon: 'ArrowRightFromArc',
    title: i18next.t(`groups:group_menu:label_leave_${type}`),
    requireIsMember: true,
    requireCanSetting: false,
    onPress: onPressLeave,
  },
  ];
  const result = [];
  defaultData.forEach((item: any) => {
    if ((item?.requireCanSetting && canSetting)
     || (item?.requireIsMember && isMember)
     || (!item?.requireCanSetting && !item?.requireIsMember)) {
      result.push({ ...item });
    }
  });

  return result;
};
