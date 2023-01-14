import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import { mockSeries } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import CreateSeries from '.';
import * as navigationHook from '~/hooks/navigation';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import useSeriesStore from '../store';
import useModalStore from '~/store/modal';

describe('CreateSeries component', () => {
  const seriesId = '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8';

  let Keyboard: any;
  let Platform: any;

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
    Platform = require('react-native').Platform;
    jest.clearAllMocks();
  });

  it('renders correctly without data', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<CreateSeries />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with role edit series', () => {
    Platform.OS = 'ios';
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<CreateSeries route={{ params: { seriesId } }} />);
    const titleComponent = wrapper.getByTestId('text_input.input');
    expect(titleComponent).toBeDefined();
    expect(titleComponent.props?.value).toEqual(mockSeries.title);

    const summaryComponent = wrapper.getByTestId('create_series.description');
    expect(summaryComponent).toBeDefined();
    expect(summaryComponent.props?.value).toEqual(mockSeries.summary);

    const buttonPublish = wrapper.getByTestId('create_series.btn_publish');
    expect(buttonPublish).toBeDefined();
    expect(buttonPublish.props?.accessibilityState?.disabled).toBe(true);
  });

  it('should navigate to select audience when click choosen audience component', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const { result: postStoreResult } = renderHook(() => usePostsStore());

    act(() => {
      postStoreResult.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<CreateSeries route={{ params: { seriesId } }} />);
    const audienceComponent = wrapper.getByTestId('create_post_chosen_audiences');
    expect(audienceComponent).toBeDefined();

    fireEvent.press(audienceComponent);

    expect(navigate).toBeCalledWith(seriesStack.seriesSelectAudience,
      { isEditAudience: true, initAudienceGroups: mockSeries.audience.groups });
  });

  it('should back to previous screen successfully if no change', () => {
    const goBack = jest.fn();
    const rootNavigation = { canGoBack: true, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const { result: postStoreResult } = renderHook(() => usePostsStore());

    act(() => {
      postStoreResult.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<CreateSeries route={{ params: { seriesId } }} />);

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(goBack).toBeCalled();
  });

  it('should show alert when changed value and click back with role edit series', () => {
    Keyboard.dismiss = jest.fn();

    const showAlert = jest.fn();
    const actions = { showAlert };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const { result: postStoreResult } = renderHook(() => usePostsStore());

    act(() => {
      postStoreResult.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<CreateSeries route={{ params: { seriesId } }} />);

    const titleComponent = wrapper.getByTestId('text_input.input');
    expect(titleComponent).toBeDefined();
    fireEvent.changeText(titleComponent, '1');

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(Keyboard.dismiss).toBeCalled();
    expect(showAlert).toBeCalled();
  });

  it('should back to previous screen successfully when click back with role create new series but cover media is empty', () => {
    const goBack = jest.fn();
    const rootNavigation = { canGoBack: true, goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<CreateSeries />);

    const titleComponent = wrapper.getByTestId('text_input.input');
    expect(titleComponent).toBeDefined();
    fireEvent.changeText(titleComponent, '1');

    const buttonBack = wrapper.getByTestId('header.back');
    fireEvent.press(buttonBack);
    expect(goBack).toBeCalled();
  });

  it('should call api edit series success when save series edited', () => {
    Keyboard.dismiss = jest.fn();
    Platform.OS = 'ios';

    const response = {
      code: 200,
      data: {
        ...mockSeries,
        title: 'titleComponent',
        summary: 'summaryComponent',
      },
      meta: {},
    };

    const spyApiEditSeries = jest.spyOn(streamApi, 'editSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result: postStoreResult } = renderHook(() => usePostsStore());

    act(() => {
      postStoreResult.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<CreateSeries route={{ params: { seriesId } }} />);

    const titleComponent = wrapper.getByTestId('text_input.input');
    expect(titleComponent).toBeDefined();
    act(() => {
      fireEvent.changeText(titleComponent, 'titleComponent');
    });

    const summaryComponent = wrapper.getByTestId('create_series.description');
    expect(summaryComponent).toBeDefined();
    act(() => {
      fireEvent.changeText(summaryComponent, 'summaryComponent');
    });

    const buttonSave = wrapper.getByTestId('create_series.btn_publish');
    act(() => {
      fireEvent.press(buttonSave);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(Keyboard.dismiss).toBeCalled();
    expect(spyApiEditSeries).toBeCalled();
  });

  it('should call api edit series failed and show alert when save audience can not remove', () => {
    Keyboard.dismiss = jest.fn();
    Platform.OS = 'android';

    const error = {
      code: 'api.validation_error',
      data: 'undefined',
      meta: {
        errors: {
          groupsDenied: [
            'eba85417-ec3e-49b4-89b4-c5393baecaaf',
          ],
        },
        message: "You don't have delete own post permission at group Community AB",
        stack: null,
      },
    };

    const spyApiEditSeries = jest.spyOn(streamApi, 'editSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showAlert = jest.fn();
    const actions = { showAlert };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result: postStoreResult } = renderHook(() => usePostsStore());
    const { result: seriesStoreResult } = renderHook(() => useSeriesStore());

    act(() => {
      postStoreResult.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<CreateSeries route={{ params: { seriesId } }} />);

    const groups = {
      groupIds: ['eba85417-ec3e-49b4-89b4-c5393baecddf'],
      userIds: [],
    };
    act(() => {
      seriesStoreResult.current.actions.setAudience(groups);
    });

    const buttonSave = wrapper.getByTestId('create_series.btn_publish');
    act(() => {
      fireEvent.press(buttonSave);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(Keyboard.dismiss).toBeCalled();
    expect(spyApiEditSeries).toBeCalled();
    expect(showAlert).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
