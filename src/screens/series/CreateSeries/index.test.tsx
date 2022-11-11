import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import usePostsStore from '~/store/entities/posts';
import modalActions from '~/storeRedux/modal/actions';
import { mockSeries } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import CreateSeries from '.';
import * as navigationHook from '~/hooks/navigation';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

describe('CreateSeries component', () => {
  const seriesId = '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8';

  let Keyboard: any;
  let Platform: any;

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
    Platform = require('react-native').Platform;
    jest.clearAllMocks();
  });

  afterEach(() => {
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

    const spyModalActions = jest.spyOn(modalActions, 'showAlert');

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
    expect(spyModalActions).toBeCalled();
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
});
