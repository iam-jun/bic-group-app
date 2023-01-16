export type ITabTypes = 'home' | 'groups' | 'notification' | 'menus';
export interface IRouteParams {
  route: {
    params: { [x: string]: any };
  };
}
