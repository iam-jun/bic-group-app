export interface IGroup {
  id: number,
  name: string,
  userCount?: number,
  parent?: any,
  parentId?: number,
  children?: IGroup[],
  type?: any,
  icon?: string,
}
