export interface IMenuItemProps {
  label: string;
  routeName: string;
  component: () => JSX.Element;
  iconName?: string;
}
