import i18n from 'i18next';
import getEnv from '~/utils/env';

export const postFeatureMenu = [
  {
    type: 'draftPost',
    title: 'settings:title_post_feature_draft',
    icon: 'FilePen',
    rightIcon: 'AngleRightSolid',
  },
];

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
      ? `${i18n.t('settings:text_version')} ${getEnv('APP_VERSION')}`
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

const settings = [
  {
    type: 'component',
    title: 'Component Collection',
    icon: 'Bug',
    path: 'component-collection',
  },
];

export default settings;
