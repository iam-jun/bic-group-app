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

export interface IGroupDetail extends IGroup{
  cover?: string,
  privacy?: string,
  type?: string,
  verified?: boolean,
  description?: string,
}
