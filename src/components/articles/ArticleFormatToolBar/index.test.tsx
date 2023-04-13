import React from 'react';
import { fireEvent, render } from '~/test/testUtils';
import ArticleFormatToolBar from '.';
import useModalStore from '~/store/modal';
import useUploaderStore from '~/store/uploader';

describe('ArticleFormatToolBar component', () => {
  const props = {
    onModalVisbleChanged: jest.fn(),
    toggleQuote: jest.fn(),
    insertLink: jest.fn(),
    insertImage: jest.fn(),
    insertEmbed: jest.fn(),
    setAlign: jest.fn(),
    toggleMark: jest.fn(),
    toggleList: jest.fn(),
    toggleHeading: jest.fn(),
  };

  it('renders correctly', () => {
    const showModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.showModal = showModal;
      return state;
    });

    const upload = jest.fn();
    useUploaderStore.setState((state) => {
      state.actions.upload = upload;
      return state;
    });

    const rendered = render(<ArticleFormatToolBar {...props} />);

    const { queryByTestId } = rendered;
    const containerView = queryByTestId('article_format_toolbar');
    expect(containerView).toBeDefined();

    const btnIcon = queryByTestId('article_format_toolbar.btn_icon');
    fireEvent.press(btnIcon);
    const formatHeadingText = queryByTestId('article_format_toolbar.format_heading_text');
    expect(formatHeadingText).toBeDefined();

    const btnParagraph = queryByTestId('article_format_toolbar.btn_paragraph');
    fireEvent.press(btnParagraph);
    const formatHeadingParagraph = queryByTestId('article_format_toolbar.format_heading_paragraph');
    expect(formatHeadingParagraph).toBeDefined();

    const btnLink = queryByTestId('article_format_toolbar.btn_link');
    fireEvent.press(btnLink);
    const btnEmbed = queryByTestId('article_format_toolbar.btn_embed');
    fireEvent.press(btnEmbed);
    expect(showModal).toBeDefined();

    const btnImage = queryByTestId('article_format_toolbar.btn_image');
    fireEvent.press(btnImage);
    expect(upload).toBeDefined();
  });
});
