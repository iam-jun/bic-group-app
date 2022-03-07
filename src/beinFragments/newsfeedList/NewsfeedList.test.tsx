import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux, configureStore, fireEvent} from '~/test/testUtils';
import NewsfeedList from './NewsfeedList';
import {colors} from '~/theme';
import homePosts from './constants';
import initialState from '~/store/initialState';
import MockedNavigator from '~/test/MockedNavigator';

afterEach(cleanup);
jest.useFakeTimers();

describe('NewsfeedList component', () => {
  const mockStore = configureStore([]);
  const storeData = {...initialState};

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <MockedNavigator component={() => <NewsfeedList data={homePosts} />} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders onEndReach correctly', () => {
    const onEndReach = jest.fn();
    const onScrollMock = jest.fn();

    const {getByTestId} = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NewsfeedList data={homePosts} onEndReach={onEndReach} />
        )}
      />,
    );

    const eventData = {
      nativeEvent: {
        contentOffset: {
          y: 500,
        },
        contentSize: {
          // Dimensions of the scrollable content
          height: 1000,
          width: 100,
        },
        // layoutMeasurement: {
        //   // Dimensions of the device
        //   height: 100,
        //   width: 100,
        // },
      },
    };

    const component = getByTestId('newsfeed_list').props.children[0];
    fireEvent.scroll(component, eventData);
    expect(onEndReach).toBeCalled();
    // expect(component).toBe('');
  });
});
