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
  canSave?: boolean;
  canCopyLink?: boolean,
  canViewReactions?: boolean,
  canViewSeries?: boolean,
  canPinContent?: boolean,
  canCreateQuiz?: boolean,
  canDeleteQuiz?: boolean,
  canEditQuiz?: boolean,
  canDelete?: boolean,
  canReportContent?: boolean,
  canReportMember?: boolean,
  enableSpecificNotifications?: boolean
}
