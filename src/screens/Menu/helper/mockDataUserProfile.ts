const userProfileDataMocksResponse = {
  data: {
    code: 200,
    data: {
      id: 1,
      cognito_uuid: 'cef3a99e-e288-4456-8d55-ee5a6771748f',
      stream_uuid: 'cef3a99e-e288-4456-8d55-ee5a6771748f',
      email: 'khoatd@evol.group',
      username: 'khoatd',
      fullname: 'Trần Đăng Khoa',
      gender: 'MALE',
      birthday: '1981-07-07',
      avatar:
        'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
      beinStaffRole: null,
      createdAt: '2021-08-06T08:00:43.869Z',
      updatedAt: '2021-08-06T08:00:43.871Z',
      deletedAt: null,
      backgroundImgUrl:
        'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
      phone: '123456789',
      address: 'this is my adress',
      language: 'Vietnamese, English',
      description: 'Bầu trời là giới hạn...',
    },
    meta: {
      message: 'Get user successfull',
    },
  },
};

export default userProfileDataMocksResponse;
