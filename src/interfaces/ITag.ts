export interface ITag {
  id: string;
  groupId: string;
  name: string;
  slug: string;
  createdBy: string;
  updatedBy: string;
  totalUsed: number;
}

export interface IParamGetCommunityTags {
  offset?: number;
  limit?: number;
  groupIds?: string[];
}

export type CreateTag = Partial<Omit<ITag, 'id'>>

export type EditTag = Partial<ITag>
