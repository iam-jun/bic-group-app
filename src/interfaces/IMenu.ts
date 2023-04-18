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
  LANGUAGE = 'language',
}
