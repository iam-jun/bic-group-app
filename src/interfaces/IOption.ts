import {IconType} from '~/resources/icons';

export interface IOption {
  type: string;
  title: string;
  subTitle?: string;
  icon: IconType;
  rightSubTitle: string;
  rightSubIcon: IconType;
}
