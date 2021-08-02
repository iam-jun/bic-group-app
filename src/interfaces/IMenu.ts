import {IconType} from '~/resources/icons';

export interface IMenuItemProps {
  label: string;
  routeName: string;
  component: () => JSX.Element;
  iconName?: IconType;
}
