import React from 'react';

import { View } from 'react-native';
import { renderWithRedux, waitForUpdateRedux } from '~/test/testUtils';
import MockedNavigator from '../../test/MockedNavigator';
import { POST_DETAIL } from '~/test/mock_data/post';
import Text from '../../beinComponents/Text';
import NewsfeedList from './index';

describe('NewsfeedList component', () => {
  it('renders correctly loading more', async () => {
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NewsfeedList
            HeaderComponent={() => (
              <View testID="newsfeed_list.header">
                <Text>HeaderComponent</Text>
              </View>
            )}
            canLoadMore
            refreshing={false}
            data={[POST_DETAIL]}
          />
        )}
      />,
    );
    await waitForUpdateRedux();
    const indicator = wrapper.queryByTestId('newsfeed_list.activity_indicator');
    expect(indicator).not.toBeNull();
  });

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

    const emptyView = wrapper.queryByTestId('newsfeed_list.empty_view');
    expect(emptyView).not.toBeNull();
  });
});
