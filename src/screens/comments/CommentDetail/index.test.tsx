import { cleanup } from '@testing-library/react-hooks';
import React from 'react';
import { cloneDeep } from 'lodash';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import CommentDetail from './index';
import * as helper from './helper';

afterEach(cleanup);

describe('CommentDetail component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const props = {
    route: {
      params: {
        commentId: 'test',
        postId: 'test',
        isReported: false,
      },
    },
  };

  it('should render correctly (isReported = true)', () => {
    const propsClone = cloneDeep(props);
    propsClone.route.params.isReported = true;

    const rendered = renderWithRedux(<CommentDetail {...propsClone} />);

    const { getByTestId } = rendered;

    const containerComponent = getByTestId('comment_detail');
    expect(containerComponent).toBeDefined();
  });

  it('should render correctly (isReported = false)', async () => {
    const spyReplacePostDetail = jest.spyOn(helper, 'replacePostDetail');

    const rendered = renderWithRedux(<CommentDetail {...props} />);

    const { getByTestId } = rendered;

    const text = getByTestId('comment_detail.text_header_title');
    expect(text).toBeDefined();
    fireEvent.press(text);
    expect(spyReplacePostDetail).toBeCalled();
  });
});
