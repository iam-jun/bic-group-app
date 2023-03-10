export const amplifyUser = {
  username: 'trannamanh',
  pool: {
    userPoolId: 'ap-southeast-1_MGxohyEmC',
    clientId: 'j71t9dm5kgn54ee8hq9559i67',
    client: {
      endpoint: 'https://cognito-idp.ap-southeast-1.amazonaws.com/',
      fetchOptions: {},
    },
    advancedSecurityDataCollectionFlag: true,
  },
  Session: null,
  client: {
    endpoint: 'https://cognito-idp.ap-southeast-1.amazonaws.com/',
    fetchOptions: {},
  },
  signInUserSession: {
    idToken: {
      jwtToken: 'jwtToken',
      payload: {
        sub: 'a91eeef0-3b5b-4e59-808a-b4b2d158eab5',
        email_verified: true,
        'custom:bein_staff_role': 'SUPER_ADMIN',
        iss: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_MGxohyEmC',
        'cognito:username': 'trannamanh',
        origin_jti: 'f034f493-15c3-4f17-8917-09dd3685a065',
        aud: 'j71t9dm5kgn54ee8hq9559i67',
        event_id: 'a95eb5ee-81b3-44e5-97aa-e5665168a03b',
        token_use: 'id',
        auth_time: 1671099279,
        exp: 1671099579,
        iat: 1671099279,
        'custom:user_uuid': '7b63852c-5249-499a-a32b-6bdaa2761fc2',
        jti: '656dd516-d86c-44db-ae3d-c7204e346bef',
        email: 'namanh@tgm.vn',
      },
    },
    refreshToken: {
      token: 'token',
    },
    accessToken: {
      jwtToken: 'jwtToken',
      payload: {
        sub: 'a91eeef0-3b5b-4e59-808a-b4b2d158eab5',
        iss: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_MGxohyEmC',
        client_id: 'j71t9dm5kgn54ee8hq9559i67',
        origin_jti: 'f034f493-15c3-4f17-8917-09dd3685a065',
        event_id: 'a95eb5ee-81b3-44e5-97aa-e5665168a03b',
        token_use: 'access',
        scope: 'aws.cognito.signin.user.admin',
        auth_time: 1671099279,
        exp: 1671099579,
        iat: 1671099279,
        jti: 'b674177f-6e9f-48d2-a905-b63b8cd0ba9b',
        username: 'trannamanh',
      },
    },
    clockDrift: -1,
  },
  authenticationFlowType: 'USER_SRP_AUTH',
  keyPrefix: 'CognitoIdentityServiceProvider.j71t9dm5kgn54ee8hq9559i67',
  userDataKey: 'CognitoIdentityServiceProvider.j71t9dm5kgn54ee8hq9559i67.trannamanh.userData',
  attributes: {
    sub: 'a91eeef0-3b5b-4e59-808a-b4b2d158eab5',
    email_verified: true,
    'custom:bein_staff_role': 'SUPER_ADMIN',
    email: 'namanh@tgm.vn',
    'custom:user_uuid': '7b63852c-5249-499a-a32b-6bdaa2761fc2',
  },
  preferredMFA: 'NOMFA',
};

export const authUser = {
  username: 'trannamanh',
  signInUserSession: {
    idToken: {
      jwtToken: 'jwtToken',
      payload: {
        sub: 'a91eeef0-3b5b-4e59-808a-b4b2d158eab5',
        email_verified: true,
        'custom:bein_staff_role': 'SUPER_ADMIN',
        iss: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_MGxohyEmC',
        'cognito:username': 'trannamanh',
        origin_jti: 'f034f493-15c3-4f17-8917-09dd3685a065',
        aud: 'j71t9dm5kgn54ee8hq9559i67',
        event_id: 'a95eb5ee-81b3-44e5-97aa-e5665168a03b',
        token_use: 'id',
        auth_time: 1671099279,
        exp: 1671099579,
        iat: 1671099279,
        'custom:user_uuid': '7b63852c-5249-499a-a32b-6bdaa2761fc2',
        jti: '656dd516-d86c-44db-ae3d-c7204e346bef',
        email: 'namanh@tgm.vn',
      },
    },
    refreshToken: {
      token: 'token',
    },
    accessToken: {
      jwtToken: 'jwtToken',
      payload: {
        sub: 'a91eeef0-3b5b-4e59-808a-b4b2d158eab5',
        iss: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_MGxohyEmC',
        client_id: 'j71t9dm5kgn54ee8hq9559i67',
        origin_jti: 'f034f493-15c3-4f17-8917-09dd3685a065',
        event_id: 'a95eb5ee-81b3-44e5-97aa-e5665168a03b',
        token_use: 'access',
        scope: 'aws.cognito.signin.user.admin',
        auth_time: 1671099279,
        exp: 1671099579,
        iat: 1671099279,
        jti: 'b674177f-6e9f-48d2-a905-b63b8cd0ba9b',
        username: 'trannamanh',
      },
    },
    clockDrift: -1,
  },
  attributes: {
    sub: 'a91eeef0-3b5b-4e59-808a-b4b2d158eab5',
    email_verified: true,
    'custom:bein_staff_role': 'SUPER_ADMIN',
    email: 'namanh@tgm.vn',
    'custom:user_uuid': '7b63852c-5249-499a-a32b-6bdaa2761fc2',
  },
  name: 'namanh',
  email: 'namanh@tgm.vn',
  id: 'trannamanh',
  role: 'trannamanh',
};

export const responseSignUp = {
  code: 'api.ok',
  meta: {
    message: 'Success',
  },
  data: {
    community: {
      id: '6841a820-80d6-4a17-a9ef-eb6e91a1f344',
      name: 'Cộng đồng thích Màu Đỏ',
      slug: '14fd4ef80c19',
      icon: 'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
      group_id: 'c0994f1a-c36d-4e36-a17a-fd56cc5d0fb9',
      privacy: 'OPEN',
      settings: {
        is_join_approval: false,
      },
      description: '123',
      background_img_url:
        'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
      created_at: '2022-05-09T06:53:03.197Z',
      updated_at: '2022-05-09T06:53:03.753Z',
      team_id: '7xagctrw9fgnxqn8dxg5e8dxxa',
      owner_id: 'a5987435-8ffc-484c-a60c-c5aea87d1c59',
      join_status: 1,
      user_count: 501,
    },
    user: {
      id: '8304243c-3a93-4b77-ad2c-105f468c7532',
      username: 'khanhhuyen',
      fullname: 'Khánh Huyền',
      email: 'khanhhuyen@evol.vn',
      avatar: 'https://cdn.dribbble.com/users/81809/screenshots/3460812/ultimategohan.jpg',
      chat_id: 'q1dz1hekh7y6zxiiixpxa8ggnr',
      bein_staff_role: 'SUPER_ADMIN',
      country_code: null,
      country: null,
      city: null,
      address: null,
      background_img_url: 'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/sssEVOL.jpg',
      birthday: null,
      description: 'nullLLL',
      gender: null,
      language: [],
      phone: null,
      relationship_status: null,
      created_at: '2022-01-10T03:03:38.250Z',
      updated_at: '2023-02-13T01:47:48.673Z',
    },
  },
};

export const responseResendVerifyEmail = {
  code: 'api.ok',
  meta: { message: 'Success' },
  data: { code_delivery_details: { attribute_name: 'email', delivery_medium: 'EMAIL', destination: 'a***@m***' } },
};
