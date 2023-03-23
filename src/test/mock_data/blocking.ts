export const responseGetListBlockingUsers = {
  code: 'api.ok',
  meta: { message: 'Success' },
  data: [
    {
      id: '32866f20-65f9-4580-86db-6d4f6388b8ac',
      fullname: 'Trai tim anh tan nat vi em',
      avatar:
        'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
      createdAt: '2023-03-23T01:55:29.917Z',
    },
  ],
};

export const responseUnblockUser = { code: 'api.ok', meta: { message: 'Unblocked user successfully' }, data: true };
