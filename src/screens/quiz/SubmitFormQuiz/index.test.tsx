import React from 'react';
import { act, renderHook, renderWithRedux } from '~/test/testUtils';
import SubmitFormQuiz from '.';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { postWithQuiz } from '~/test/mock_data/quiz';
import { IPost } from '~/interfaces/IPost';

describe('SubmitFormQuiz', () => {
  it('should render correctly', () => {
    const { result } = renderHook(() => usePostsStore());
    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const wrapper = renderWithRedux(<MockedNavigator component={() => <SubmitFormQuiz route={{ params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' } }} />} />);

    expect(wrapper).toMatchSnapshot();
  });
});
