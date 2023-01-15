import { ITag } from '~/interfaces/ITag';
import { searchSeriesRequestParams } from './series';

export const mockGetTagsInArticle = [
  {
    id: 1,
    name: 'tag 1',
    slug: 'tag-1',
    total: 12,
  },
  {
    id: 2,
    name: 'tag 2',
    slug: 'tag-2',
    total: 12,
  },
  {
    id: 3,
    name: 'tag 3',
    slug: 'tag-3',
    total: 12,
  },
  {
    id: 4,
    name: 'tag 4',
    slug: 'tag-4',
    total: 12,
  },
  {
    id: 5,
    name: 'tag 5',
    slug: 'tag-5',
    total: 12,
  },
  {
    id: 6,
    name: 'tag 6',
    slug: 'tag-6',
    total: 12,
  },
  {
    id: 7,
    name: 'tag 7',
    slug: 'tag-7',
    total: 12,
  },
];

export const searchTagsRequestParams = searchSeriesRequestParams;

export const mockTags: ITag[] = [
  {
    id: '1',
    name: 'tag 1',
    slug: 'tag-1',
    totalUsed: 12,
    groupId: '1',
    createdBy: '',
    updatedBy: '',
  },
  {
    id: '2',
    name: 'tag 2',
    slug: 'tag-2',
    totalUsed: 0,
    groupId: '1',
    createdBy: '',
    updatedBy: '',
  },
  {
    id: '3',
    name: 'tag 3',
    slug: 'tag-3',
    totalUsed: 12,
    groupId: '1',
    createdBy: '',
    updatedBy: '',
  },
  {
    id: '4',
    name: 'tag 4',
    slug: 'tag-4',
    totalUsed: 12,
    groupId: '1',
    createdBy: '',
    updatedBy: '',
  },
  {
    id: '5',
    name: 'tag 5',
    slug: 'tag-5',
    totalUsed: 12,
    groupId: '1',
    createdBy: '',
    updatedBy: '',
  },
  {
    id: '6',
    name: 'tag 6',
    slug: 'tag-6',
    totalUsed: 12,
    groupId: '1',
    createdBy: '',
    updatedBy: '',
  },
  {
    id: '7',
    name: 'tag 7',
    slug: 'tag-7',
    totalUsed: 12,
    groupId: '1',
    createdBy: '',
    updatedBy: '',
  },
];

export const mockTagsInArticle = [
  {
    groupId: 'b01fb58e-9299-4a0e-a55f-9839293fb42a',
    id: '21a08db3-92d2-4758-a64c-d22e2ba01f33',
    name: 'tag 1',
    slug: 'tag 1',
    totalUsed: 11,
    createdBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
    updatedBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
  },
  {
    groupId: 'b01fb58e-9299-4a0e-a55f-9839293fb42a',
    id: 'f8614f2a-c746-493e-a861-60029ec75f8c',
    name: 'tag 2',
    slug: 'tag 2',
    totalUsed: 6,
    createdBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
    updatedBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
  },
];
