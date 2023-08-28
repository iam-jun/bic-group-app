import { IconType } from '~/resources/icons';

export interface ISettings {
  icon: IconType | number;
  title: string;
  isAccordion?: boolean;
  listAccordion?: IAccordion[];
  onPress?: () => void;
}

export interface IAccordion {
  type: string;
  title: string;
  icon: IconType | number;
  rightSubTitle?: string;
  rightSubIcon?: string;
  onPress: () => void;
}

export enum SettingsAndPrivacyType {
  SECURITY = 'security',
  BLOCKING = 'blocking',
  NOTIFICATIONS = 'notifications',
  LANGUAGE = 'language',
  PRIVACY = 'privacy',
}

export interface IMenu {
  canEdit?: boolean;
  canEditSetting?: boolean;
  isSave?: boolean;
  canCopyLink?: boolean;
  canViewReactions?: boolean;
  canViewSeries?: boolean;
  canPinContent?: boolean;
  canCreateQuiz?: boolean;
  canDeleteQuiz?: boolean;
  canEditQuiz?: boolean;
  canDelete?: boolean;
  canReportContent?: boolean;
  canReportMember?: boolean;
  isEnableNotifications?: boolean;
}

export interface IOptionsRenderMenu {
  keyMenu: string;
  leftIcon: IconType;
  title: string;
  onPress: () => void;
  alwaysShow?: boolean;
  shouldBeHidden?: boolean;
  isShowBorderTop?: boolean;
  isShowBorderBottom?: boolean;
  isDanger?: boolean;
}
