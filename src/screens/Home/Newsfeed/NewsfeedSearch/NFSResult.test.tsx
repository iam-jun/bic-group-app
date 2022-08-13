import React from 'react';
import { renderWithRedux, configureStore } from '~/test/testUtils';
import initialState from '~/store/initialState';
import NFSResult from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSResult';
import { POST_DETAIL_2 } from '~/test/mock_data/post';

const mockPost = {
  actor: {
    createdAt: '2022-01-14T04:58:45.776555Z',
    updatedAt: '2022-02-08T08:23:26.447557Z',
    id: '20',
    data: {
      avatar:
        'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
      fullname: 'Trần Nam Anh',
      username: 'trannamanh',
    },
  },
  audience: {
    groups: [
      {
        id: '6',
        collection: 'groups',
        foreign_id: 'groups:6',
        data: {
          icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
          name: 'EVOL Community',
        },
        createdAt: '2022-01-14T07:42:18.184353Z',
        updatedAt: '2022-01-14T07:42:18.184353Z',
      },
    ],
    users: [],
  },
  foreign_id: '84a2f2c0-ef0f-41eb-861e-42c61f8416ce',
  id: '846d2200-7ccc-11ec-8080-800048691d62',
  important: {
    active: 0,
    expires_time: '',
  },
  mentions: {
    groups: [],
    users: [],
  },
  object: {
    id: '97b30674-5de3-4696-8867-55022f9f81db',
    collection: 'post',
    foreign_id: 'post:97b30674-5de3-4696-8867-55022f9f81db',
    data: {
      content: 'hello',
      files: [],
      images: [],
      videos: [],
      highlight: '==hello==',
    },
    createdAt: '2022-01-24T04:17:16.585495Z',
    updatedAt: '2022-01-24T04:17:17.216444Z',
  },
  origin: null,
  reaction_counts: {
    grinning_face_with_one_large_and_one_small_eye: 1,
  },
  settings: {
    can_comment: true,
    can_react: true,
    can_share: true,
  },
  target: '',
  time: '2022-01-24T04:17:17.856000',
  type: 'post',
  verb: 'post',
};

describe('NFSResult component', () => {
  it('should render loading search result', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.loadingResult = true;
    storeData.home.newsfeedSearch.searchResults = [];
    storeData.home.newsfeedSearch.searchText = 'hello';
    const mockStore = configureStore([]);
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<NFSResult />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render empty search result', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.loadingResult = false;
    storeData.home.newsfeedSearch.searchResults = [];
    storeData.home.newsfeedSearch.searchText = 'hello';
    const mockStore = configureStore([]);
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<NFSResult />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list search result', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.loadingResult = false;
    storeData.home.newsfeedSearch.searchResults = [
      { ...POST_DETAIL_2, highlight: '==Important== post' },
    ] as any;
    storeData.home.newsfeedSearch.searchText = 'important';
    const mockStore = configureStore([]);
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<NFSResult />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
