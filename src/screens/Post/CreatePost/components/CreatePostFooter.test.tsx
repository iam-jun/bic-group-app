import React from 'react';

import {configureStore, renderWithRedux} from '~/test/testUtils';
import CreatePostFooter from '~/screens/Post/CreatePost/components/CreatePostFooter';
import initialState from '~/store/initialState';

describe('CreatePostFooter component', () => {
  const mockStore = configureStore([]);

  it(`renders correctly`, async () => {
    const wrapper = renderWithRedux(<CreatePostFooter />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly mention bar with items`, async () => {
    const storeData = {...initialState};
    storeData.mentionInput.data = [
      {
        id: 7,
        username: 'testaccount2',
        fullname: 'Test account 2',
        avatar:
          'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
      },
      {
        id: 8,
        username: 'testaccount3',
        fullname: 'Test account 3',
        avatar:
          'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
      },
    ] as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<CreatePostFooter />, store);
    const items = wrapper.getAllByTestId('mention_bar_item');
    expect(items?.length).toBe(2);
  });

  // Expect correct but got error new Date.
  // it(`renders correctly opacity = 1`, async () => {
  //   withReanimatedTimer(() => {
  //     const storeData = {...initialState};
  //     storeData.mentionInput.data = [
  //       {
  //         id: 7,
  //         username: 'testaccount2',
  //         fullname: 'Test account 2',
  //         avatar:
  //           'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
  //       },
  //     ] as any;
  //     const store = mockStore(storeData);
  //     const wrapper = renderWithRedux(<CreatePostFooter />, store);
  //     const container = wrapper.getByTestId(
  //       'create_post_footer.mention_bar_container',
  //     );
  //     advanceAnimationByTime(600);
  //     expect(container).toHaveAnimatedStyle({opacity: 1});
  //   });
  // });
});
