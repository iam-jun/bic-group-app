import React from 'react';
import {
  act, renderWithRedux,
} from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost, PostStatus } from '~/interfaces/IPost';
import Schedule from './Schedule';

describe('Schedule', () => {
  it('should render correctly', () => {
    const article = { ...mockArticle };
    article.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const handleOpenPopupScheduleMock = jest.fn();

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Schedule
            isValidating={false}
            validButton
            handleOpenPopupSchedule={handleOpenPopupScheduleMock}
          />
        )}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  // it('should validate series vs tags', async () => {
  //   const spyApiValidateSeriesTags = jest.spyOn(streamApi, 'validateSeriesTags').mockImplementation(
  //     () => Promise.resolve() as any,
  //   );

  //   const article = { ...mockArticle };
  //   article.status = PostStatus.DRAFT;

  //   act(() => {
  //     usePostsStore.getState().actions.addToPosts({ data: article as IPost });
  //   });

  //   const wrapper = renderWithRedux(
  //     <MockedNavigator
  //       component={() => (
  //         <Schedule
  //           contentId={article.id}
  //           contentType={PostType.ARTICLE}
  //         />
  //       )}
  //     />,
  //   );

  //   const btn = wrapper.getByTestId('button.content');

  //   act(() => {
  //     fireEvent.press(btn);
  //   });

  //   expect(useValidateSeriesTags.getState().isValidating).toBe(true);
  //   expect(spyApiValidateSeriesTags).toBeCalled();
  // });

  // it('validate series vs tags fail', async () => {
  //   const spyApiValidateSeriesTags = jest.spyOn(streamApi, 'validateSeriesTags').mockImplementation(
  //     () => Promise.reject() as any,
  //   );

  //   const article = { ...mockArticle };
  //   article.status = PostStatus.DRAFT;

  //   act(() => {
  //     usePostsStore.getState().actions.addToPosts({ data: article as IPost });
  //   });

  //   const wrapper = renderWithRedux(
  //     <MockedNavigator
  //       component={() => (
  //         <Schedule
  //           contentId={article.id}
  //           contentType={PostType.ARTICLE}
  //         />
  //       )}
  //     />,
  //   );

  //   const btn = wrapper.getByTestId('button.content');

  //   act(() => {
  //     fireEvent.press(btn);
  //   });

  //   expect(spyApiValidateSeriesTags).toBeCalled();
  // });
});
