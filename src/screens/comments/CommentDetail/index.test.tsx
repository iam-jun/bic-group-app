import { cleanup } from '@testing-library/react-hooks';
import React from 'react';
import { cloneDeep } from 'lodash';
import initialState from '~/storeRedux/initialState';
import { configureStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import CommentDetail from './index';
import APIErrorCode from '~/constants/apiErrorCode';
import * as helper from './helper';

afterEach(cleanup);

describe('CommentDetail component', () => {
  const mockStore = configureStore([]);
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.post.commentErrorCode = '';
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

    storeData.post.commentErrorCode = APIErrorCode.Post.COMMENT_DELETED;
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<CommentDetail {...propsClone} />, store);

    const { getByTestId } = rendered;

    const containerComponent = getByTestId('comment_detail');
    expect(containerComponent).toBeDefined();
  });

  it('should render correctly (isReported = false)', async () => {
    const spyReplacePostDetail = jest.spyOn(helper, 'replacePostDetail');

    const store = mockStore(storeData);
    const rendered = renderWithRedux(<CommentDetail {...props} />, store);

    const { getByTestId } = rendered;

    const text = getByTestId('comment_detail.text_header_title');
    expect(text).toBeDefined();
    fireEvent.press(text);
    expect(spyReplacePostDetail).toBeCalled();
  });
});
