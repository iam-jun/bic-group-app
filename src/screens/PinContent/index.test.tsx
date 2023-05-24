import React from 'react';
import streamApi from '~/api/StreamApi';
import PinContent from './index';
import MockedNavigator from '~/test/MockedNavigator';
import {
  act,
  renderWithRedux,
  waitFor,
  renderHook,
  fireEvent,
} from '~/test/testUtils';
import { pinnableAudiencesResponse } from '~/test/mock_data/pinContent';
import usePinContentStore from '~/components/PinContent/store';
import AlertModal from '~/beinComponents/modals/AlertModal';
import useModalStore from '~/store/modal';
import Toast from '~/baseComponents/Toast';
import APIErrorCode from '~/constants/apiErrorCode';

describe('PinContent screen', () => {
  it('should show loading pinnable audiences', async () => {
    const spyApiGetPinnableAudiences = jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve({}));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => <PinContent route={{ params: { postId: '123' } }} />}
      />,
    );

    expect(spyApiGetPinnableAudiences).toBeCalled();

    const loadingView = wrapper.getByTestId('pin_content.loading');

    expect(loadingView).toBeDefined();
  });

  it('given loading no pinnable audiences should show empty pinnable audiences', async () => {
    const spyApiGetPinnableAudiences = jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve({ data: { groups: [] } }));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => <PinContent route={{ params: { postId: '123' } }} />}
      />,
    );

    expect(spyApiGetPinnableAudiences).toBeCalled();

    await waitFor(() => {
      const emptyView = wrapper.getByTestId('pin_content.empty');
      expect(emptyView).toBeDefined();
    });
  });

  it('given get pinnable audiences success should render pinnable audiences', async () => {
    const spyApiGetPinnableAudiences = jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve(pinnableAudiencesResponse));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => <PinContent route={{ params: { postId: '123' } }} />}
      />,
    );

    expect(spyApiGetPinnableAudiences).toBeCalled();

    await waitFor(() => {
      const lstPinnableAudiences = wrapper.getAllByTestId(
        'pin_content.pin_audience_item',
      );
      expect(lstPinnableAudiences.length).toBe(
        pinnableAudiencesResponse.data.groups.length,
      );
    });
  });

  it('should checkable pinnable audiences', async () => {
    jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve(pinnableAudiencesResponse));
    const { result } = renderHook(() => usePinContentStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => <PinContent route={{ params: { postId: '123' } }} />}
      />,
    );

    await waitFor(() => {
      expect(result.current.prevAudiences.length).toBe(
        pinnableAudiencesResponse.data.groups.length,
      );
    });

    const groupId = pinnableAudiencesResponse.data.groups[0].id;

    const firstAudience = wrapper.getByTestId(
      `pin_content.pin_audience_item_${groupId}`,
    );

    act(() => {
      fireEvent.press(firstAudience);
    });

    await waitFor(() => {
      expect(result.current.pinAudiences[groupId].group.isPinned).toBe(true);
    });
  });

  it('should show alert when go back if has changed pin audiences', async () => {
    jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve(pinnableAudiencesResponse));
    const { result } = renderHook(() => usePinContentStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <>
            <PinContent route={{ params: { postId: '123' } }} />
            <AlertModal />
          </>
        )}
      />,
    );

    await waitFor(() => {
      expect(result.current.prevAudiences.length).toBe(
        pinnableAudiencesResponse.data.groups.length,
      );
    });

    const groupId = pinnableAudiencesResponse.data.groups[0].id;

    const firstAudience = wrapper.getByTestId(
      `pin_content.pin_audience_item_${groupId}`,
    );

    act(() => {
      fireEvent.press(firstAudience);
    });

    await waitFor(() => {
      expect(result.current.pinAudiences[groupId].group.isPinned).toBe(true);
    });

    const btnBack = wrapper.getByTestId('header.back.button');

    act(() => {
      fireEvent.press(btnBack);
    });

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
  });

  it('should show toast when saving pin audiences success', async () => {
    jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve(pinnableAudiencesResponse));
    jest
      .spyOn(streamApi, 'updatePinContent')
      .mockImplementation(() => Promise.resolve({}));
    const { result } = renderHook(() => usePinContentStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <>
            <PinContent route={{ params: { postId: '123' } }} />
            <Toast />
          </>
        )}
      />,
    );

    await waitFor(() => {
      expect(result.current.prevAudiences.length).toBe(
        pinnableAudiencesResponse.data.groups.length,
      );
    });

    const groupId = pinnableAudiencesResponse.data.groups[0].id;

    const firstAudience = wrapper.getByTestId(
      `pin_content.pin_audience_item_${groupId}`,
    );

    act(() => {
      fireEvent.press(firstAudience);
    });

    await waitFor(() => {
      expect(result.current.pinAudiences[groupId].group.isPinned).toBe(true);
    });

    const btnSave = wrapper.getByTestId('header.button');

    act(() => {
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      expect(useModalStore.getState().toast).toBeDefined();
      expect(result.current.groupPinContent[groupId].data.length).toBe(1);
    });
  });

  it('should show error when saving pin audiences error', async () => {
    const groupId = pinnableAudiencesResponse.data.groups[0].id;
    jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve(pinnableAudiencesResponse));
    jest
      .spyOn(streamApi, 'updatePinContent')
      .mockImplementation(() => Promise.reject({
        code: APIErrorCode.Post.CONTENT_NO_PIN_PERMISSION,
        meta: { message: 'error', errors: { groupsDenied: [groupId] } },
      }));
    const { result } = renderHook(() => usePinContentStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <>
            <PinContent route={{ params: { postId: '123' } }} />
            <Toast />
          </>
        )}
      />,
    );

    await waitFor(() => {
      expect(result.current.prevAudiences.length).toBe(
        pinnableAudiencesResponse.data.groups.length,
      );
    });

    const firstAudience = wrapper.getByTestId(
      `pin_content.pin_audience_item_${groupId}`,
    );

    act(() => {
      fireEvent.press(firstAudience);
    });

    await waitFor(() => {
      expect(result.current.pinAudiences[groupId].group.isPinned).toBe(true);
    });

    const btnSave = wrapper.getByTestId('header.button');

    act(() => {
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      expect(result.current.pinAudiences[groupId].error).toBeDefined();
    });
  });

  it('should pin all audiences success', async () => {
    jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve(pinnableAudiencesResponse));
    const { result } = renderHook(() => usePinContentStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PinContent route={{ params: { postId: '123' } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(result.current.prevAudiences.length).toBe(
        pinnableAudiencesResponse.data.groups.length,
      );
    });

    const pinOrUnpinBtn = wrapper.getByTestId(
      'pin_content.pin_or_unpin_all_audience_checkbox',
    );

    act(() => {
      fireEvent.press(pinOrUnpinBtn);
    });

    await waitFor(() => {
      Object.keys(result.current.pinAudiences).forEach((key) => {
        expect(result.current.pinAudiences[key].group.isPinned).toBe(true);
        expect(result.current.pinAudiences[key].error).toBeFalsy();
      });
    });
  });

  it('should unpin all audiences success', async () => {
    const res = { ...pinnableAudiencesResponse };
    res.data.groups = res.data.groups.map((group) => ({
      ...group,
      isPinned: true,
    }));
    jest
      .spyOn(streamApi, 'getPinnableAudiences')
      .mockImplementation(() => Promise.resolve(res));
    const { result } = renderHook(() => usePinContentStore((state) => state));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PinContent route={{ params: { postId: '123' } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(result.current.prevAudiences.length).toBe(
        res.data.groups.length,
      );
    });

    const pinOrUnpinBtn = wrapper.getByTestId(
      'pin_content.pin_or_unpin_all_audience_checkbox',
    );

    act(() => {
      fireEvent.press(pinOrUnpinBtn);
    });

    await waitFor(() => {
      Object.keys(result.current.pinAudiences).forEach((key) => {
        expect(result.current.pinAudiences[key].group.isPinned).toBeFalsy();
        expect(result.current.pinAudiences[key].error).toBeFalsy();
      });
    });
  });
});
