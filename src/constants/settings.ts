import i18n from 'i18next';

import {getEnv} from '~/utils/env';

export const appSettingsMenu = [
  {
    type: 'accountSettings',
    title: 'settings:title_account_settings',
    icon: 'iconMenuSetting',
  },
];

export const documentsMenu = [
  {
    type: 'aboutBein',
    title: 'settings:title_about_bein',
    icon: 'iconMenuInfo',
    disableClick: true,
    rightSubTitle: getEnv('APP_VERSION')
      ? i18n.t('settings:text_version') + ' ' + getEnv('APP_VERSION')
      : undefined,
  },
  {
    type: 'help',
    title: 'settings:title_help',
    icon: 'iconMenuHelp',
  },
  {
    type: 'appPolicies',
    title: 'settings:title_app_policies',
    icon: 'iconMenuMenu',
  },
  {
    type: 'feedback',
    title: 'settings:title_feedback',
    icon: 'iconMenuFeedback',
  },
];

export const logoutMenu = [
  {
    type: 'logOut',
    title: 'auth:text_sign_out',
    icon: 'iconMenuLogout',
  },
];

export default [
  {
    type: 'component',
    title: 'Component Collection',
    icon: 'Bug',
  },
];

export const accountSettingsMenu = [
  {
    type: 'userProfile',
    title: 'settings:title_user_profile',
    icon: 'User',
  },
  {
    type: 'securityLogin',
    title: 'settings:title_security_login',
    icon: 'Lock',
  },
  {
    type: 'privacy',
    title: 'settings:title_privacy',
    icon: 'ShieldCheck',
  },
  {
    type: 'notification',
    title: 'settings:title_notification',
    icon: 'bell',
  },
  {
    type: 'appearance',
    title: 'settings:title_appearance',
    icon: 'Monitor',
    rightSubTitle: 'Dark',
    rightSubIcon: 'AngleRightB',
  },
  {
    type: 'language',
    title: 'settings:title_language',
    icon: 'Globe',
    rightSubTitle: 'settings:app_language',
    rightSubIcon: 'AngleRightB',
  },
  {
    type: 'currency',
    title: 'settings:title_currency',
    icon: 'Coins',
    rightSubTitle: 'BIC',
    rightSubIcon: 'AngleRightB',
  },
];

export const securityLoginMenu = {
  password: [
    {
      type: 'changePassword',
      title: 'settings:title_change_password',
      subTitle: 'settings:subtitle_change_password',
      rightSubIcon: 'AngleRightB',
      icon: 'KeySkeleton',
    },
  ],
  security: [
    {
      type: 'twoFactorAuthentication',
      title: 'settings:title_two_factor_authentication',
      subTitle: 'settings:subtitle_two_factor_authentication',
      rightSubIcon: 'AngleRightB',
      icon: 'ShieldCheck',
    },
    {
      type: 'loginLogs',
      title: 'settings:title_login_logs',
      subTitle: 'settings:subtitle_login_logs',
      rightSubIcon: 'AngleRightB',
      icon: 'KeySkeleton',
    },
  ],
};
