/* eslint-disable @typescript-eslint/no-var-requires */
import * as RNCommunityHooks from '@react-native-community/hooks';
import * as React from 'react';
import {StyleSheet} from 'react-native';
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
      keyboardHeight: 336,
      searchQuery: '',
      loading: false,
      modalTopOffset: 0,
    });

    const rendered = render(<StickerView {...baseProps} />);

    expect(rendered).toMatchSnapshot();
  });

  it('renders loading', async () => {
    reactMock.useState = setHookTestState({
      keyboardHeight: 336,
      searchQuery: '',
      loading: true,
      modalTopOffset: 0,
    });

    const rendered = render(<StickerView {...baseProps} />);

    const loading_indicator = rendered.getByTestId('loading_indicator');
    expect(loading_indicator).toBeDefined();

    const grid_view = rendered.getByTestId('sticker_view.grid_view');
    const flattenedStyle = StyleSheet.flatten(grid_view.props.style);
    expect(flattenedStyle.height).toBe(0);
  });
});
