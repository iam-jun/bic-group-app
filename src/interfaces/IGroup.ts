export interface IGroup {
  id: number,
  name: string,
  userCount: number,
  parentId?: number,
  children?: IGroup[],
  type?: any,
  icon?: string,
}
