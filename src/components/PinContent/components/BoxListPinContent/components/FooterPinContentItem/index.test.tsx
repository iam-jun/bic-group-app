import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import FooterPinContentItem from './index';
import { POST_DETAIL } from '~/test/mock_data/post';

describe('FooterPinContentItem component', () => {
    it('renders correctly', () => {
        const rendered = renderWithRedux(<FooterPinContentItem
            canComment={true}
            canReact={true}
            commentsCount={POST_DETAIL.commentsCount}
            reactionsCount={POST_DETAIL.reactionsCount}
        />);
        const { queryByTestId } = rendered;
        const footerPinContentItem = queryByTestId('footer_pin_content_item.view');
        const reactItem = queryByTestId('footer_pin_content_item.react');
        const commentItem = queryByTestId('footer_pin_content_item.comment');
        expect(footerPinContentItem).toBeDefined();
        expect(reactItem).toBeDefined();
        expect(commentItem).toBeDefined();
    });

    it('renders empty when cannot react and comment', () => {
        const rendered = renderWithRedux(<FooterPinContentItem
            canComment={false}
            canReact={false}
            commentsCount={POST_DETAIL.commentsCount}
            reactionsCount={POST_DETAIL.reactionsCount}
        />);
        const { queryByTestId } = rendered;
        const footerPinContentItem = queryByTestId('footer_pin_content_item.view');
        expect(footerPinContentItem).toBeNull();
    });

    it('should not renders react item when cannot react', () => {
        const rendered = renderWithRedux(<FooterPinContentItem
            canComment={true}
            canReact={false}
            commentsCount={POST_DETAIL.commentsCount}
            reactionsCount={POST_DETAIL.reactionsCount}
        />);
        const { queryByTestId } = rendered;
        const reactItem = queryByTestId('footer_pin_content_item.react');
        const commentItem = queryByTestId('footer_pin_content_item.comment');
        expect(reactItem).toBeNull();
        expect(commentItem).toBeDefined();
    });

    it('should not renders commnent item when cannot comment', () => {
        const rendered = renderWithRedux(<FooterPinContentItem
            canComment={false}
            canReact={true}
            commentsCount={POST_DETAIL.commentsCount}
            reactionsCount={POST_DETAIL.reactionsCount}
        />);
        const { queryByTestId } = rendered;
        const commentItem = queryByTestId('footer_pin_content_item.comment');
        const reactItem = queryByTestId('footer_pin_content_item.react');
        expect(commentItem).toBeNull();
        expect(reactItem).toBeDefined();
    });
});
