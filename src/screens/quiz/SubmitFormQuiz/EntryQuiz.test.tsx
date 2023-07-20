import React from 'react';
import {
  act,
  fireEvent,
  renderHook,
  renderWithRedux,
  waitFor,
} from '~/test/testUtils';
import EntryQuiz from './EntryQuiz';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { mockGenerateQuizResponse, postWithQuiz } from '~/test/mock_data/quiz';
import { IPost } from '~/interfaces/IPost';
import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import { PermissionKey } from '~/constants/permissionScheme';
import streamApi from '~/api/StreamApi';
import useQuizzesStore from '~/store/entities/quizzes';

describe('SubmitFormQuiz', () => {
  it('should render correctly', async () => {
    const { result } = renderHook(() => usePostsStore());
    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EntryQuiz
            route={{
              params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' },
            }}
          />
        )}
      />,
    );

    await waitFor(() => {
      wrapper.getByTestId('question_answer_section.question');
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should show alert when user press back', async () => {
    const { result } = renderHook(() => usePostsStore());
    await act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const wrapper = renderWithRedux(<MockedNavigator
      component={() => <EntryQuiz route={{ params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' } }} />}
    />);

    let inputQuestion;
    await waitFor(() => {
      inputQuestion = wrapper.getByTestId('question_answer_section.question');
    });

    await act(() => {
      fireEvent.changeText(inputQuestion, '11');
    });

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
  });

  it('should create quiz success', async () => {
    jest.spyOn(groupApi, 'getMyPermissions').mockImplementation(
      () => Promise.resolve({
        data: {
          communities: {},
          groups: {
            '18508ac3-2bfc-4172-b071-1d67f1b1e05b': [PermissionKey.CUD_QUIZ],
            'aeab68c2-bcec-4edb-a78b-60c0ee90afd7': [PermissionKey.CUD_QUIZ],
            'b01fb58e-9299-4a0e-a55f-9839293fb42a': [PermissionKey.CUD_QUIZ],
          },
        },
      }) as any,
    );
    jest.spyOn(streamApi, 'generateQuiz').mockImplementation(
      () => Promise.resolve(mockGenerateQuizResponse) as any,
    );

    const { result: resultUseQuizzesStore } = renderHook(() => useQuizzesStore());

    const { result } = renderHook(() => usePostsStore());
    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const wrapper = renderWithRedux(<MockedNavigator
      component={() => <EntryQuiz route={{ params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' } }} />}
    />);

    await waitFor(() => {
      wrapper.getByTestId('question_answer_section.question');
    });

    const btnNext = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnNext.props.disabled).toBeFalsy();
    });

    fireEvent.press(btnNext);

    await waitFor(() => {
      expect(resultUseQuizzesStore.current.data[mockGenerateQuizResponse.data.id]).toBeDefined();
    });
  });
});
