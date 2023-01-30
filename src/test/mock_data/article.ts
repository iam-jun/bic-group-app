import { PostStatus } from '~/interfaces/IPost';
import { mockTagsInArticle } from './tags';

export const mockArticle = {
  owner_reactions: [

  ],
  id: 'c46bb2fb-61d6-4981-bde0-d54d12ea7e13',
  content: '[{"type":"p","children":[{"text":"Hổng biết viết gì hết"}]}]',
  lang: 'vi',
  media: {
    videos: [

    ],
    images: [

    ],
    files: [

    ],
  },
  setting: {
    canReact: true,
    canComment: true,
    canShare: true,
    isImportant: false,
    importantExpiredAt: null,
  },
  status: PostStatus.PUBLISHED,
  isProcessing: false,
  actor: {
    id: 'a0143446-0e51-4903-b280-8c794d470903',
    username: 'thuquyen',
    fullname: 'Nguyen Thi Thu Quyền',
    avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/c6b8b056-7d77-4382-b95c-010c2fda4809.jpg',
    email: 'thuquyen@tgm.vn',
  },
  mentions: {

  },
  commentsCount: 0,
  totalUsersSeen: 2,
  reactionsCount: {
    0: {
      bic_heart_gift: 1,
    },
  },
  createdAt: '2022-11-14T08:39:47.609Z',
  updatedAt: '2022-11-15T10:11:01.630Z',
  createdBy: 'a0143446-0e51-4903-b280-8c794d470903',
  audience: {
    groups: [
      {
        isCommunity: true,
        communityId: '020a31b5-25a4-443a-a04d-9f3cfe2ca6b0',
        id: '452f371c-58c3-45cb-abca-d68c70b82df2',
        icon: 'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
        name: 'Community của Hoàng',
        privacy: 'PUBLIC',
        rootGroupId: '452f371c-58c3-45cb-abca-d68c70b82df2',
      },
      {
        isCommunity: true,
        communityId: 'ce58beb6-6b0d-414b-ab0b-a5f37bebe68f',
        id: '91830f8b-3ab1-4899-8811-c4d18af457b5',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a5f52b92-9e6a-4ff9-9420-c14861d1be16.jpg',
        name: 'Bock Bock',
        privacy: 'PUBLIC',
        rootGroupId: '91830f8b-3ab1-4899-8811-c4d18af457b5',
      },
    ],
  },
  comments: {
    list: [

    ],
    meta: {
      limit: 10,
      offset: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  type: 'ARTICLE',
  privacy: 'PUBLIC',
  linkPreview: null,
  title: 'Article thứ 4 edited ',
  summary: '1234567890-= lalalalallalallalalala and I will be there at the',
  categories: [
    {
      id: '9a4bd7b8-5cf3-460b-997f-3a59190d706e',
      name: 'Others',
    },
  ],
  series: [
    {
      id: 'd1a89fb8-fc11-4733-8fe7-4ef32c5d2919',
      title: 'Đây là series có 3 bài articles',
    },
  ],
  hashtags: [

  ],
  views: 0,
  coverMedia: {
    id: 'fdaa3c06-b1d2-4c88-9b09-ea0b38ce85ab',
    url: 'https://bic-dev-user-upload-images-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/fa2a7cde-eee0-4c09-9784-45e1c1ef7e6b.png',
    type: 'image',
    createdBy: 'a0143446-0e51-4903-b280-8c794d470903',
    name: 'fa2a7cde-eee0-4c09-9784-45e1c1ef7e6b.png',
    origin_name: 'Screen Shot 2022-05-10 at 17.50.05.png',
    width: 1070,
    height: 1016,
    extension: 'png',
    status: 'completed',
    size: 1705350,
    mime_type: 'image/png',
    thumbnails: null,
    createdAt: '2022-11-14T08:39:17.784Z',
  },
  tags: mockTagsInArticle,
  publishedAt: '',
};
