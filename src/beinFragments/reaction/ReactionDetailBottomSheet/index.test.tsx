import * as React from 'react';
import {cleanup} from '@testing-library/react-native';

import {fireEvent, renderWithRedux, configureStore} from '~/test/testUtils';
import ReactionDetailBottomSheet from './index';
import initialState from '~/store/initialState';

afterEach(cleanup);

describe('ReactionDetailBottomSheet component', () => {
  const mockStore = configureStore([]);

  const listUserReact = [
    {
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/75f92c17-843b-49de-8445-93531854fd65.jpeg',
      fullname: 'Hoàng Minh Trọng',
      id: '53',
    },
    {
      avatar:
        'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
      fullname: 'Nguyễn Thị Ngọc Linh',
      id: '33',
    },
    {
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/363963d1-e89a-4899-855e-44b1f66401dc.jpg',
      fullname: 'Nguyen Thi Thu Queen',
      id: '58',
    },
  ];
  const getDataPromise = jest.fn().mockImplementation(() => {
    Promise.resolve(listUserReact);
  });
  const fake_data = {
    getDataParam: {
      commentId: undefined,
      postId: 'efe9c800-92be-11ec-8080-800124087730',
    },
    getDataPromise: getDataPromise,
    initReaction: 'sweat_smile',
    isOpen: true,
    reactionCounts: {
      comment: 9,
      comment_count: 11,
      grinning_face_with_star_eyes: 2,
      kissing_closed_eyes: 2,
      kissing_smiling_eyes: 2,
      sweat_smile: 3,
    },
  };
  it('renders correctly', () => {
    const storeData = {...initialState};

    // @ts-ignore
    storeData.modal.reactionDetailBottomSheet = fake_data;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <ReactionDetailBottomSheet />,
      store,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  // reaction_detail_bottomSheet.react_item;

  //   it(`should call navigate to user profile when click item`, () => {
  //     const storeData = {...initialState};

  //     // @ts-ignore
  //     storeData.modal.reactionDetailBottomSheet = fake_data;
  //     const store = mockStore(storeData);

  //     const rendered = renderWithRedux(<ReactionDetailBottomSheet />, store);

  //     const btnComponent = rendered.getByTestId(
  //       'reaction_detail_bottomSheet.user_item',
  //     );
  //     expect(btnComponent).toBeDefined();
  //     fireEvent.press(btnComponent);
  //   });

  // it(`should call navigate to user profile when click item`, () => {
  //   const storeData = {...initialState};

  //   // @ts-ignore
  //   storeData.modal.reactionDetailBottomSheet = fake_data;
  //   const store = mockStore(storeData);

  //   const rendered = renderWithRedux(<ReactionDetailBottomSheet />, store);

  //   const btnComponent = rendered.getByTestId(
  //     'reaction_detail_bottomSheet.user_item',
  //   );
  //   expect(btnComponent).toBeDefined();
  //   fireEvent.press(btnComponent);
  // });
});
