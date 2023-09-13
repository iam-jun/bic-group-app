export type ITabTypes = 'home' | 'groups' | 'notification' | 'menus';
export interface IRouteParams {
  navigation?: any;
  route: {
    params: { [x: string]: any };
  };
}
