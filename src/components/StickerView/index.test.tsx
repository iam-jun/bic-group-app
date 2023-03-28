/* eslint-disable @typescript-eslint/no-var-requires */
import * as RNCommunityHooks from '@react-native-community/hooks';
import * as React from 'react';
import { render, setHookTestState } from '~/test/testUtils';
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
  // let Platform = { OS: 'ios' };

  beforeEach(() => {
    jest.spyOn(RNCommunityHooks, 'useKeyboard').mockImplementation(() => ({
      keyboardShown: false,
      coordinates: {
        start: undefined,
        end: {
          screenX: 0, screenY: 0, width: 0, height: 0,
        },
      },
      keyboardHeight: 0,
    }));

    // Platform = require('react-native').Platform;
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
});
