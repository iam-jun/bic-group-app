import i18n from 'i18next';

import {getEnv} from '~/utils/env';

export const postFeatureMenu = [
  {
    type: 'draftPost',
    title: 'settings:title_post_feature_draft',
    icon: 'FilePen',
    rightIcon: 'AngleRightSolid',
  },
];

export const appSettingsMenu = [
  {
    type: 'accountSettings',
    title: 'settings:title_account_settings',
    icon: 'iconMenuSetting',
    path: 'settings',
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
    path: 'component-collection',
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
    icon: 'Bell',
  },
  {
    type: 'appearance',
    title: 'settings:title_appearance',
    icon: 'Monitor',
    rightSubTitle: 'Dark',
    rightSubIcon: 'AngleRightSolid',
  },
  {
    type: 'language',
    title: 'settings:title_language',
    icon: 'Globe',
    rightSubTitle: 'settings:app_language',
    rightSubIcon: 'AngleRightSolid',
  },
  {
    type: 'currency',
    title: 'settings:title_currency',
    icon: 'Coins',
    rightSubTitle: 'BIC',
    rightSubIcon: 'AngleRightSolid',
  },
];

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

export const settingsMenu = [
  {
    type: 'accountSettings',
    title: 'settings:title_account_settings',
    icon: 'Gear',
    rightIcon: 'AngleRightSolid',
  },
];

export const infoMenu = [
  {
    type: 'aboutBein',
    title: 'settings:title_about_bein',
    icon: 'CircleInfo',
    rightTitle: getEnv('APP_VERSION')
      ? i18n.t('settings:text_version') + ' ' + getEnv('APP_VERSION')
      : undefined,
  },
  {
    type: 'appPolicies',
    title: 'settings:title_app_policies',
    icon: 'BookOpen',
  },
  {
    type: 'help_and_support',
    title: 'settings:title_help_and_support',
    icon: 'CircleQuestion',
  },
  {
    type: 'feedback',
    title: 'settings:title_feedback',
    icon: 'CommentSmile',
  },
];
