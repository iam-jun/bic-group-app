/* eslint-disable @typescript-eslint/no-var-requires */
import * as RNCommunityHooks from '@react-native-community/hooks';
import * as React from 'react';
import * as Animated from 'react-native-reanimated';
import {render, setHookTestState} from '~/test/testUtils';
import StickerView from '.';

describe('StickerView component', () => {
  const stickerViewRef = jest.spyOn(React, 'useRef').mockReturnValue({
    current: {
      show: jest.fn(),
    },
  });
  const baseProps = {
    stickerViewRef,
    onMediaSelect: jest.fn(),
  };

  const reactMock = require('react');
  let Platform = {OS: 'ios'};

  beforeEach(() => {
    jest.spyOn(RNCommunityHooks, 'useKeyboard').mockImplementation(() => {
      return {
        keyboardShown: false,
        coordinates: {
          start: undefined,
          end: {screenX: 0, screenY: 0, width: 0, height: 0},
        },
        keyboardHeight: 0,
      };
    });

    Platform = require('react-native').Platform;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    reactMock.useState = setHookTestState({
      visible: true,
      isExpanded: false,
      keyboardHeight: 0,
      searchQuery: '',
    });
    const rendered = render(<StickerView {...baseProps} />);

    expect(rendered).toMatchSnapshot();
  });

  it('renders null', async () => {
    reactMock.useState = setHookTestState({
      visible: false,
      isExpanded: false,
      keyboardHeight: 0,
      searchQuery: '',
    });
    const rendered = render(<StickerView {...baseProps} />);

    expect(rendered).toMatchSnapshot();
  });

  it(`animated_view should be showed`, () => {
    reactMock.useState = setHookTestState({
      visible: true,
      isExpanded: false,
      keyboardHeight: 0,
      searchQuery: '',
    });

    jest.spyOn(Animated, 'useAnimatedStyle').mockImplementation(() => {
      return {
        height: 336,
      };
    });

    const rendered = render(<StickerView {...baseProps} />);

    const animated_view = rendered.getByTestId('sticker_view.animated_view');

    expect(animated_view).toBeDefined();
    expect(animated_view.props.style.height).toBe(336);
  });

  it(`animated_view should be expanded`, () => {
    reactMock.useState = setHookTestState({
      visible: true,
      isExpanded: true,
      keyboardHeight: 0,
      searchQuery: '',
    });

    const rendered = render(<StickerView {...baseProps} />);

    const animated_view = rendered.getByTestId('sticker_view.animated_view');

    expect(animated_view).toBeDefined();
    expect(animated_view.props.style.height).toBe('100%');
  });

  it('should show KeyboardSpacer if platform is android', () => {
    reactMock.useState = setHookTestState({
      visible: true,
      isExpanded: false,
      keyboardHeight: 0,
      searchQuery: '',
    });

    Platform.OS = 'android';

    const rendered = render(<StickerView {...baseProps} />);

    const keyboard_spacer = rendered.getByTestId(
      'sticker_view.keyboard_spacer',
    );

    expect(keyboard_spacer).toBeDefined();
  });
});
