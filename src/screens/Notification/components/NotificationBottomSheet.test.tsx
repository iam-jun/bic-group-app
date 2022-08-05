import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';

import NotificationBottomSheet from './NotificationBottomSheet';
import { renderWithRedux } from '~/test/testUtils';
import notificationsActions from '../redux/actions';
import * as modalActions from '~/store/modal/actions';

afterEach(cleanup);

describe('NotificationBottomSheet component', () => {
  const baseSheetRef = jest.fn();
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <NotificationBottomSheet flag="ALL" modalizeRef={baseSheetRef} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should called markAsReadAll action when click mark all as read item', () => {
    const spy = jest.spyOn(notificationsActions, 'markAsReadAll');
    const rendered = renderWithRedux(
      <NotificationBottomSheet flag="ALL" modalizeRef={baseSheetRef} />,
    );
    const markAllAsReadComponent = rendered.getByTestId(
      'notifications.mark_all_as_read',
    );
    expect(markAllAsReadComponent).toBeDefined();
    fireEvent.press(markAllAsReadComponent);

    expect(spy).toBeCalled();
  });

  it('should called showAlertNewFeature action when click notification setting item', () => {
    const spy = jest.spyOn(modalActions, 'showAlertNewFeature');
    const rendered = renderWithRedux(
      <NotificationBottomSheet flag="ALL" modalizeRef={baseSheetRef} />,
    );
    const notificationSettingComponent = rendered.getByTestId(
      'notifications.notification_settings',
    );
    expect(notificationSettingComponent).toBeDefined();
    fireEvent.press(notificationSettingComponent);

    expect(spy).toBeCalled();
  });
});
