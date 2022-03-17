import React from 'react';

import {renderWithRedux} from '~/test/testUtils';
import NewsfeedList from './NewsfeedList';
import MockedNavigator from '~/test/MockedNavigator';
import {POST_DETAIL} from '~/test/mock_data/post';
import {View} from 'react-native';
import Text from '~/beinComponents/Text';

// const homePosts = [
//   POST_DETAIL,
//   POST_DETAIL,
//   POST_DETAIL,
//   POST_DETAIL,
//   POST_DETAIL,
//   POST_DETAIL,
//   POST_DETAIL,
//   POST_DETAIL,
//   POST_DETAIL,
//   POST_DETAIL,
// ];

beforeEach(() => {
  jest.useFakeTimers();
});

describe('NewsfeedList component', () => {
  it('renders correctly with 1 item', async () => {
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => <NewsfeedList data={[POST_DETAIL]} />}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly loading more', async () => {
    jest.useFakeTimers('legacy');

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NewsfeedList
            HeaderComponent={() => (
              <View testID={'newsfeed_list.header'}>
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

    const indicator = wrapper.queryByTestId('newsfeed_list.activity_indicator');
    expect(indicator).not.toBeNull();
  });

  it('renders correctly cant load more', async () => {
    jest.useFakeTimers('legacy');

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NewsfeedList
            HeaderComponent={() => (
              <View testID={'newsfeed_list.header'}>
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

  /**
   * Can't test some cases below because of recycler list view
   */
  // it('renders correctly with header component', () => {
  //   const wrapper = renderWithRedux(
  //     <MockedNavigator
  //       component={() => (
  //         <NewsfeedList
  //           canLoadMore
  //           refreshing={false}
  //           data={[POST_DETAIL]}
  //           HeaderComponent={() => (
  //             <View testID={'newsfeed_list.header'}>
  //               <Text>HeaderComponent</Text>
  //             </View>
  //           )}
  //         />
  //       )}
  //     />,
  //   );
  //   const header = wrapper.queryByTestId('newsfeed_list.header');
  //   expect(header).not.toBeNull();
  // });

  // it('should scroll', async () => {
  //   const onEndReach = jest.fn();
  //
  //   const eventData = {
  //     nativeEvent: {
  //       contentOffset: {
  //         y: 500,
  //       },
  //       contentSize: {
  //         // Dimensions of the scrollable content
  //         height: 500,
  //         width: 100,
  //       },
  //       layoutMeasurement: {
  //         // Dimensions of the device
  //         height: 100,
  //         width: 100,
  //       },
  //     },
  //   };
  //
  //   const {getByTestId} = renderWithRedux(
  //     <MockedNavigator
  //       component={() => (
  //         <NewsfeedList data={homePosts} onEndReach={onEndReach} />
  //       )}
  //     />,
  //   );
  //   const list = getByTestId('newsfeed_list.list');
  //   fireEvent.scroll(list, eventData);
  // });

  // it('renders correctly refreshing', () => {});
});
