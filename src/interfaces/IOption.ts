import icons from '~/constants/icons';

export interface IOption {
  type: string;
  title: string;
  icon: keyof typeof icons;
}
