import React from 'react';
import { mockGetTagsInArticle } from '~/test/mock_data/tags';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SelectingListInfo from '.';
import colors from '~/theme/theme';

describe('SelectingListInfo Component', () => {
  it('renders correctly', () => {
    const onRemoveItem = jest.fn();
    const rendered = renderWithRedux(
      <SelectingListInfo
        data={mockGetTagsInArticle}
        onRemoveItem={onRemoveItem}
      />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly with prop title', () => {
    const onRemoveItem = jest.fn();
    const title = 'Title';

    const rendered = renderWithRedux(
      <SelectingListInfo
        data={mockGetTagsInArticle}
        title={title}
        onRemoveItem={onRemoveItem}
      />,
    );
    const componentTitle = rendered.getByTestId('aritcles.slecting_list_info.info_title');
    expect(componentTitle).toBeDefined();
    expect(componentTitle.props?.children).toBe(title);
  });
  it('renders correctly with prop infoMessage', () => {
    const onRemoveItem = jest.fn();
    const infoMessage = 'Info message';
    const rendered = renderWithRedux(
      <SelectingListInfo
        data={mockGetTagsInArticle}
        type="test"
        infoMessage={infoMessage}
        onRemoveItem={onRemoveItem}
      />,
    );

    const componentInfoMessage = rendered.queryByTestId('aritcles.slecting_list_info.info_message.text');
    expect(componentInfoMessage).toBeDefined();
    expect(componentInfoMessage.props?.children).toBe(infoMessage);
  });
  it('renders correctly with prop tagProps', () => {
    const onRemoveItem = jest.fn();
    const rendered = renderWithRedux(
      <SelectingListInfo
        data={mockGetTagsInArticle}
        onRemoveItem={onRemoveItem}
        tagProps={{
          type: 'neutral',
        }}
      />,
    );

    const tagItems = rendered.queryAllByTestId('tag.item');
    expect(tagItems).toBeDefined();
    expect(tagItems[0].props?.style?.backgroundColor).toBe(colors.light.colors.neutral2);
  });
  it('should call prop onRemoveItem', () => {
    const onRemoveItem = jest.fn();
    const rendered = renderWithRedux(
      <SelectingListInfo
        data={mockGetTagsInArticle}
        onRemoveItem={onRemoveItem}
      />,
    );
    const componentsCheckbox = rendered.queryAllByTestId('tag.icon');
    expect(componentsCheckbox).toBeDefined();

    fireEvent.press(componentsCheckbox[0]);
    expect(onRemoveItem).toBeCalledWith(mockGetTagsInArticle[0]);
  });
});
