import React from 'react';

import NoticePanel from './index';
import { renderWithRedux, fireEvent, cleanup } from '~/test/testUtils';

afterEach(cleanup);

describe('NoticePanel component', () => {
  const title = 'home:notice_post_video_uploading:title';
  const description = 'home:notice_post_video_uploading:description';
  const buttonText = 'button text';

  it('renders correctly', () => {
    const onButtonPress = jest.fn();
    const onClose = jest.fn();

    const rendered = renderWithRedux(<NoticePanel
      title={title}
      description={description}
      buttonText={buttonText}
      onButtonPress={onButtonPress}
      onClose={onClose}
    />).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('should call props onButtonPress', () => {
    const onButtonPress = jest.fn();
    const onClose = jest.fn();

    const rendered = renderWithRedux(<NoticePanel
      title={title}
      description={description}
      buttonText={buttonText}
      onButtonPress={onButtonPress}
      onClose={onClose}
    />);
    const button = rendered.getByTestId('notice_panel.button_update');
    expect(button).toBeDefined();
    fireEvent.press(button);
    expect(onButtonPress).toBeCalled();
  });

  it('should call props onClose', () => {
    const onClose = jest.fn();

    const rendered = renderWithRedux(<NoticePanel
      title={title}
      description={description}
      onClose={onClose}
    />);

    const button = rendered.getByTestId('notice_panel.button_close');
    expect(button).toBeDefined();
    fireEvent.press(button);
    expect(onClose).toBeCalled();
  });
});
