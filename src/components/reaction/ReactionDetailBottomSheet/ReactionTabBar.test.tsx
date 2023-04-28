/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import lodash from 'lodash';

import {
  fireEvent, cleanup, render,
} from '../../../test/testUtils';
import { reactionsCount } from '~/test/mock_data/reactions';
import ReactionTabBar from './ReactionTabBar';

afterEach(cleanup);

describe('ReactionDetailBottomSheet component', () => {
  it('should render list user react correspondingly when clicking reaction item on ReactionTabBar', () => {
    const onChangeTab = jest.fn();
    const spy = jest.spyOn(lodash, 'debounce');

    const rendered = render(
      <ReactionTabBar
        initReaction="grinning_face_with_star_eyes"
        reactionsCount={reactionsCount}
        onChangeTab={onChangeTab}
      />,
    );

    const btnComponent = rendered.getByTestId(
      'reaction_detail_bottomSheet.kissing_closed_eyes',
    );
    expect(btnComponent).toBeDefined();

    jest.useFakeTimers();

    fireEvent.press(btnComponent);
    expect(spy).toBeCalled();
    jest.runAllTimers();
    expect(onChangeTab).toBeCalled();
  });
});
