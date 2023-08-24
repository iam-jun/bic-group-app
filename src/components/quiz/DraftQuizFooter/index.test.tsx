import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import DraftQuizFooter from '.';
import { postWithQuiz } from '~/test/mock_data/quiz';
import { QuizStatus, GenStatus } from '~/interfaces/IQuiz';

describe('DraftQuizFooter', () => {
  it('should render correctly', () => {
    const dataProps = {
      ...postWithQuiz.data,
      quiz: {
        status: QuizStatus.DRAFT,
      },
    };

    const wrapper = renderWithRedux(
      <DraftQuizFooter
        data={dataProps as any}
      />,
    );

    const content = wrapper.getByTestId('draft_quiz_footer.content');

    expect(content).toBeDefined();
  });

  it('should not render when quiz status is not PUBLISHED', () => {
    const dataProps = {
      ...postWithQuiz.data,
    };

    const wrapper = renderWithRedux(
      <DraftQuizFooter
        data={dataProps as any}
      />,
    );

    const content = wrapper.queryByTestId('draft_quiz_footer.content');

    expect(content).toBeNull();
  });

  it('should render gen status FAILED', () => {
    const dataProps = {
      ...postWithQuiz.data,
      quiz: {
        genStatus: GenStatus.FAILED,
      },
    };

    const wrapper = renderWithRedux(
      <DraftQuizFooter
        data={dataProps as any}
      />,
    );

    const failLabel = wrapper.queryByTestId('quiz:gen_status_quiz_process_fail');

    expect(failLabel).toBeDefined();
  });

  it('should render gen status PROCESSING', () => {
    const dataProps = {
      ...postWithQuiz.data,
      quiz: {
        genStatus: GenStatus.PROCESSING,
      },
    };

    const wrapper = renderWithRedux(
      <DraftQuizFooter
        data={dataProps as any}
      />,
    );

    const processingLabel = wrapper.queryByTestId('quiz:gen_status_quiz_processing');

    expect(processingLabel).toBeDefined();
  });

  it('should render gen status PENDING', () => {
    const dataProps = {
      ...postWithQuiz.data,
      quiz: {
        genStatus: GenStatus.PENDING,
      },
    };

    const wrapper = renderWithRedux(
      <DraftQuizFooter
        data={dataProps as any}
      />,
    );

    const pendingLabel = wrapper.queryByTestId('quiz:gen_status_quiz_waiting_process');

    expect(pendingLabel).toBeDefined();
  });
});
