import React from 'react';

import { View } from 'react-native';
import { renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '../../../../test/MockedNavigator';
import Text from '../../../../baseComponents/Text';
import NewsfeedList from './index';

describe('NewsfeedList component', () => {
  // it('renders correctly loading more', async () => {
  //   const wrapper = renderWithRedux(
  //     <MockedNavigator
  //       component={() => (
  //         <NewsfeedList
  //           HeaderComponent={() => (
  //             <View testID="newsfeed_list.header">
  //               <Text>HeaderComponent</Text>
  //             </View>
  //           )}
  //           canLoadMore
  //           refreshing={false}
  //           data={[POST_DETAIL]}
  //         />
  //       )}
  //     />,
  //   );
  //   await waitForUpdateRedux();
  //   const indicator = wrapper.queryByTestId('newsfeed_list.activity_indicator');
  //   expect(indicator).not.toBeNull();
  // });

  it('renders correctly cant load more', async () => {
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NewsfeedList
            HeaderComponent={() => (
              <View testID="newsfeed_list.header">
                <Text>HeaderComponent</Text>
              </View>
            )}
            canLoadMore={false}
            refreshing={false}
            data={[]}
          />
        )}
      />,
    );

    const emptyView = wrapper.queryByTestId('newsfeed_list.empty_list');
    expect(emptyView).not.toBeNull();
  });
});
