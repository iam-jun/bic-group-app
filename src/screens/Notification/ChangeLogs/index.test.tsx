import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import {
  mockChangeLogData,
} from '~/test/mock_data/notifications';
import ChangeLogs from './index';
import useNotificationStore from '../store';
import notificationApi from '~/api/NotificationApi';

describe('ChangeLogs Screen', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
  const notificationId = 'a3100e1b-f682-46cc-a6b9-5e30807beba9';
  const activity: any = mockChangeLogData?.data?.activities?.[0] || {};

  it('should render correctly', () => {
    useNotificationStore.setState((state) => {
      state.changelogsInfo = activity.changelogsInfo;
      state.changelogsInfoLoading = false;
      state.actions.getChangelogNotification = jest.fn();
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ChangeLogs route={{
            params: { id: notificationId },
          }}
          />
        )}
      />,
    );

    const screenView = wrapper.getByTestId('changelog_screen');
    expect(screenView).toBeDefined();

    const contentComponent = wrapper.getByTestId('changelog_screen.content');
    expect(contentComponent).toBeDefined();
  });

  it('should render loading if changelogsInfoLoading=true', () => {
    const spy = jest.spyOn(notificationApi, 'getChangelogNotification').mockImplementation(
      () => Promise.resolve(mockChangeLogData) as any,
    );
    useNotificationStore.setState((state) => {
      state.changelogsInfoLoading = true;
      //   state.actions.getChangelogNotification = jest.fn();
      return state;
    });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ChangeLogs route={{
            params: { id: notificationId },
          }}
          />
        )}
      />,
    );

    expect(spy).toBeCalledWith(notificationId);

    const screenView = wrapper.getByTestId('changelog_screen');
    expect(screenView).toBeDefined();

    const loadingComponent = wrapper.getByTestId('changelog_screen.loading');
    expect(loadingComponent).toBeDefined();
  });

  it('should render error if changelogsInfoLoading=false', () => {
    useNotificationStore.setState((state) => {
      state.changelogsInfoLoading = false;
      state.changelogsInfo = null;
      state.actions.getChangelogNotification = jest.fn();
      return state;
    });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ChangeLogs route={{
            params: { id: notificationId },
          }}
          />
        )}
      />,
    );

    const screenView = wrapper.getByTestId('changelog_screen');
    expect(screenView).toBeDefined();

    const errorComponent = wrapper.getByTestId('changelog_screen.error');
    expect(errorComponent).toBeDefined();
  });

  it('should render null if notification id = undefined', () => {
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ChangeLogs route={{
            params: { id: undefined },
          }}
          />
        )}
      />,
    );

    const screenView = wrapper.queryByTestId('changelog_screen');
    expect(screenView).toBeNull();
  });
});
