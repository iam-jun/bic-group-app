import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import RepliesComment from '.';
import { mockComment } from '~/test/mock_data/comment';

describe('RepliesComment component', () => {
    const dataCommnent = {
        ...mockComment,
        totalReply: 1,
    };

    it('renders correctly', () => {
        const onPress = jest.fn();

        const rendered = renderWithRedux(<RepliesComment
            onPress={onPress}
            commentData={dataCommnent}
        />);

        const content = rendered.getByTestId('replies_comment.count_reply');
        expect(content).toBeDefined();
    });

     it('renders empty when totalReply = 0', () => {
        const onPress = jest.fn();

        const rendered = renderWithRedux(<RepliesComment
            onPress={onPress}
            commentData={mockComment}
        />);

        const content = rendered.queryByTestId('replies_comment.count_reply');
        expect(content).toBeNull();
    });
});
