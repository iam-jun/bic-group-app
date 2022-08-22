export const securityLoginMenu = {
  password: [
    {
      type: 'changePassword',
      title: 'settings:title_change_password',
      subTitle: 'settings:subtitle_change_password',
      rightSubIcon: 'AngleRightSolid',
      icon: 'KeySkeleton',
    },
  ],
  security: [
    {
      type: 'twoFactorAuthentication',
      title: 'settings:title_two_factor_authentication',
      subTitle: 'settings:subtitle_two_factor_authentication',
      rightSubIcon: 'AngleRightSolid',
      icon: 'ShieldCheck',
    },
    {
      type: 'loginLogs',
      title: 'settings:title_login_logs',
      subTitle: 'settings:subtitle_login_logs',
      rightSubIcon: 'AngleRightSolid',
      icon: 'KeySkeleton',
    },
  ],
};
