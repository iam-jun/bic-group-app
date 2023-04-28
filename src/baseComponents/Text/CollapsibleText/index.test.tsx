/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';

import CollapsibleText from '.';
import {
  fireEvent,
  languages,
} from '~/test/testUtils';

afterEach(cleanup);

describe('Collapsible Text component', () => {
  const description
    = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting. Remaining essentially unchanged. It was popularised in the 1960s simply dummy text printing standard dummy text.\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.';

  it('renders correctly testID', () => {
    const rendered = render(
      <CollapsibleText testID="collapsible_text" content={description} />,
    );
    const { getByTestId } = rendered;
    const collapsibleTextComponent = getByTestId('collapsible_text');
    expect(collapsibleTextComponent).toBeDefined();
  });

  it('should render short text with a short length and limit the length', () => {
    const rendered = render(
      <CollapsibleText
        shortLength={50}
        limitLength={50}
        content={description}
      />,
    );
    const { getByTestId } = rendered;
    const shortTextComponent = getByTestId('collapsible_text.content');
    expect(shortTextComponent.props.children.length).toBe(50 + 3);
    const shortTextButtonComponent = getByTestId('collapsible_text.short_content');
    expect(shortTextButtonComponent.props.children).toBe(
      languages.common.text_see_more,
    );
  });

  it('should render full text when click read more button text ', () => {
    const rendered = render(<CollapsibleText content={description} />);
    const { getByTestId } = rendered;
    const btnSeeMore = getByTestId('collapsible_text.short_content');
    fireEvent.press(btnSeeMore);
    expect(btnSeeMore.props.children).toBe(languages.common.text_see_less);
    const fullTextComponent = getByTestId('collapsible_text.content');
    expect(fullTextComponent.props.children.length).toBe(description.length);
  });

  it('should call props onPress', () => {
    const onPress = jest.fn();

    const rendered = render(
      <CollapsibleText
        testID="collapsible_text"
        content={description}
        onPress={onPress}
      />,
    );

    const collapsibleTextBtn = rendered.getByTestId('collapsible_text');
    expect(collapsibleTextBtn).toBeDefined();
    fireEvent.press(collapsibleTextBtn);
    expect(onPress).toBeCalled();
  });
});
