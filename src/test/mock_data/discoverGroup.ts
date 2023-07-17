import GroupJoinStatus from '~/constants/GroupJoinStatus';

export const mockDiscoverGroupsResponse = {
  code: 'api.ok',
  meta: {
    message: 'Success',
    total: 3,
    offset: 0,
    limit: 25,
    hasNextPage: false,
  },
  data: [
    {
      id: '98484609-5673-4f9e-bdbd-790bcce88577',
      communityId: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
      name: '123',
      slug: 'ancient-apparition',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
      privacy: 'PRIVATE',
      level: 1,
      backgroundImgUrl: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
      userCount: 3,
      joinStatus: GroupJoinStatus.VISITOR,
    },
    {
      id: '1155635a-b16f-47e7-bad2-6cd41e9e8890',
      communityId: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
      name: '1155635a-b16f-47e7-bad2-6cd41e9e8890',
      slug: 'new-one-1',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/1b1daa64-aca8-42ea-8569-b7d8ad521e95.png',
      privacy: 'CLOSED',
      level: 1,
      backgroundImgUrl: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
      userCount: 5,
      joinStatus: GroupJoinStatus.REQUESTED,
    },
    {
      id: 'c74a74e6-9dfd-4fe1-9803-4ed2c4339da2',
      communityId: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
      name: 'Abaddon',
      slug: 'abaddon',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
      privacy: 'CLOSED',
      level: 1,
      backgroundImgUrl: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
      userCount: 0,
      joinStatus: GroupJoinStatus.VISITOR,
    },
  ],
};

export const mockJoinNewGroupResponse = { code: 'api.ok', meta: { message: 'Sent request successfully' }, data: { joinStatus: GroupJoinStatus.REQUESTED } };
