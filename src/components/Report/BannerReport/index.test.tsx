import React from 'react';
import usePostsStore from '~/store/entities/posts';

import { renderWithRedux } from '~/test/testUtils';
import BannerReport from './index';
import useCommentsStore from '~/store/entities/comments';
import { NOTI_HIDE_COMMENT, NOTI_HIDE_POST } from '~/test/mock_data/notifications';

describe('BannerReport screen', () => {
  it('render case Post correctly', () => {
    const { actions } = usePostsStore.getState();
    actions.addToPosts({ data: NOTI_HIDE_POST as any, handleComment: true });

    const rendered = renderWithRedux(<BannerReport postId={NOTI_HIDE_POST.id} />);

    expect(rendered).toMatchSnapshot();

    const containerView = rendered.queryByTestId('banner_report');
    expect(containerView).not.toBeNull();
  });

  it('render case Comment correctly', () => {
    const { actions } = useCommentsStore.getState();
    actions.addToComments([NOTI_HIDE_COMMENT]);

    const rendered = renderWithRedux(<BannerReport commentId={NOTI_HIDE_COMMENT.id} />);

    expect(rendered).toMatchSnapshot();

    const containerView = rendered.queryByTestId('banner_report');
    expect(containerView).not.toBeNull();
  });
});
