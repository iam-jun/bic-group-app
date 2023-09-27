import React from "react";
import { act, renderWithRedux } from '~/test/testUtils';
import PostReviewSchedule from './index';
import usePostsStore from "~/store/entities/posts";
import { POST_DETAIL } from '~/test/mock_data/post';
import { PostStatus } from "~/interfaces/IPost";
import MockedNavigator from "~/test/MockedNavigator";

describe('PostReviewSchedule', () => {
  it('should render correctly', () => {
    const post = { ...POST_DETAIL };
    post.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: post as any });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PostReviewSchedule
            route={{
              params: {
                postId: POST_DETAIL.id,
              },
            }}
          />
        )}
      />
    );

    const content = wrapper.getByTestId('post_review_schedule');
    expect(content).toBeDefined();
  });

  it('should render correctly when post deleted', () => {
    const post = {
      ...POST_DETAIL,
      deleted: true,
    };
    post.status = PostStatus.DRAFT;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: post as any });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PostReviewSchedule
            route={{
              params: {
                postId: POST_DETAIL.id,
              },
            }}
          />
        )}
      />
    );

    const content = wrapper.getByTestId('post_review_schedule.deleted');
    expect(content).toBeDefined();
  });
});
