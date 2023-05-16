import { act } from '@testing-library/react-hooks';
import * as React from 'react';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import RNPermissions from 'react-native-permissions';
import { fireEvent, renderHook, renderWithRedux } from '~/test/testUtils';
import PostToolbar from '.';
import useCreatePostStore from '../../store';
import ImagePicker from '~/components/ImagePicker';
import DocumentPicker from '~/beinComponents/DocumentPicker';

describe('PostToolbar component', () => {
  const onPressBack = jest.fn();
  const onPressSetting = jest.fn();
  const onPressTags = jest.fn();
  const onPressSeries = jest.fn();

  it('should render correctly', () => {
    const { result: toolbarRefResult } = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    const wrapper = renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should go back', () => {
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    act(() => {
      if (toolbarRefResult?.current?.current) {
        toolbarRefResult?.current?.current?.goBack();
      }
    });

    expect(onPressBack).toBeCalled();
  });

  it('should go back', () => {
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    act(() => {
      if (toolbarRefResult?.current?.current) {
        toolbarRefResult?.current?.current?.goBack();
      }
    });

    expect(onPressBack).toBeCalled();
  });

  it('should open modal markdown preview', () => {
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    const wrapper = renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    const btnMarkdownPreview = wrapper.getByTestId('post_toolbar.markdown_preview');

    act(() => {
      fireEvent.press(btnMarkdownPreview);
    });

    const previewMarkdownComp = wrapper.getByTestId('review_markdown.open');

    expect(previewMarkdownComp).toBeDefined();
  });

  it('should close modal markdown preview when back', () => {
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    const wrapper = renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    const btnMarkdownPreview = wrapper.getByTestId('post_toolbar.markdown_preview');

    act(() => {
      fireEvent.press(btnMarkdownPreview);
    });

    act(() => {
      if (toolbarRefResult?.current?.current) {
        toolbarRefResult?.current?.current?.goBack();
      }
    });

    const previewMarkdownComp = wrapper.getByTestId('review_markdown.close');

    expect(previewMarkdownComp).toBeDefined();
  });

  it('should pressable text help', () => {
    const isAvailable = jest.spyOn(InAppBrowser, 'isAvailable').mockImplementation(() => Promise.resolve(true) as any);
    const openBrowser = jest.spyOn(InAppBrowser, 'open');
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    const wrapper = renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    const btnTextHelp = wrapper.getByTestId('post_toolbar.text_help');

    jest.useFakeTimers();

    act(() => {
      fireEvent.press(btnTextHelp);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(isAvailable).toBeCalled();
    expect(openBrowser).toBeCalled();
  });

  it('should pressable text help', () => {
    const isAvailable = jest.spyOn(InAppBrowser, 'isAvailable').mockImplementation(() => Promise.resolve(true) as any);
    const openBrowser = jest.spyOn(InAppBrowser, 'open');
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    const wrapper = renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    const btnTextHelp = wrapper.getByTestId('post_toolbar.text_help');

    jest.useFakeTimers();

    act(() => {
      fireEvent.press(btnTextHelp);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(isAvailable).toBeCalled();
    expect(openBrowser).toBeCalled();
  });

  it('should open video picker', () => {
    const checkPermission = jest.spyOn(RNPermissions, 'check').mockImplementation(() => Promise.resolve(RNPermissions.RESULTS.GRANTED) as any);
    const openVideoPicker = jest.spyOn(ImagePicker, 'openPickerSingle').mockImplementation(() => Promise.resolve({}) as any);
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    const wrapper = renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    const btnAddVideo = wrapper.getByTestId('post_toolbar.add_video');

    jest.useFakeTimers();

    act(() => {
      fireEvent.press(btnAddVideo);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(checkPermission).toBeCalled();
    expect(openVideoPicker).toBeCalled();
  });

  it('should open file picker', () => {
    const filesPicker = jest.spyOn(DocumentPicker, 'openPickerMultiple').mockImplementation(() => Promise.resolve([{ size: 100 }]) as any);
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    const wrapper = renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    const btnAddFile = wrapper.getByTestId('post_toolbar.add_file');

    jest.useFakeTimers();

    act(() => {
      fireEvent.press(btnAddFile);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(filesPicker).toBeCalled();
    expect(useCreatePostStore.getState().createPost.files.length).toBe(1);
  });

  it('should pressable tags, series and settings', () => {
    const { result: toolbarRefResult }: any = renderHook(() => React.useRef());
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        content: 'abc',
      });
    });

    const wrapper = renderWithRedux(<PostToolbar
      toolbarRef={toolbarRefResult.current}
      disabled={false}
      imageDisabled={false}
      videoDisabled={false}
      fileDisabled={false}
      onPressBack={onPressBack}
      onPressSetting={onPressSetting}
      isSetting
      settingDisabled={false}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />);

    const btnAddTags = wrapper.getByTestId('post_toolbar.tag');
    const btnAddSeries = wrapper.getByTestId('post_toolbar.series');
    const btnSettings = wrapper.getByTestId('header.menuIcon.button');

    act(() => {
      fireEvent.press(btnAddTags);
      fireEvent.press(btnAddSeries);
      fireEvent.press(btnSettings);
    });

    expect(onPressTags).toBeCalled();
    expect(onPressSeries).toBeCalled();
    expect(onPressSetting).toBeCalled();
  });
});
