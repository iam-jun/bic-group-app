import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import initialState from '~/store/initialState';

import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import {
  fireEvent,
  renderWithRedux,
  configureStore,
  languages,
} from '~/test/testUtils';

afterEach(cleanup);

describe('Collapsible Text component', () => {
  const mockStore = configureStore([]);

  const description
    = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting. Remaining essentially unchanged. It was popularised in the 1960s simply dummy text printing standard dummy text.\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.';

  const mentionName = '@vantest1';
  const commentData = {
    data: {
      mentions: {
        users: {
          vantest1: {
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'vantest1',
              username: 'vantest1',
            },
          },
        },
      },
    },
  };

  it('renders correctly', () => {
    const rendered = render(<CollapsibleText content={description} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly testID', () => {
    const rendered = render(
      <CollapsibleText testID="collapsible_text" content={description} />,
    );
    const { getByTestId } = rendered;
    const collapsibleTextComponent = getByTestId('collapsible_text');
    expect(collapsibleTextComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
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
    const shortTextButtonComponent = getByTestId('collapsible_text.show_text');
    expect(shortTextButtonComponent.props.children).toBe(
      languages.common.text_see_more,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render full text when click read more button text ', () => {
    const rendered = render(<CollapsibleText content={description} />);
    const { getByTestId } = rendered;
    const btnSeeMore = getByTestId('collapsible_text.show_text');
    fireEvent.press(btnSeeMore);
    expect(btnSeeMore.props.children).toBe(languages.common.text_see_less);
    const fullTextComponent = getByTestId('collapsible_text.content');
    expect(fullTextComponent.props.children.length).toBe(description.length);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with markdown', () => {
    const storeData = { ...initialState };

    // @ts-ignore
    storeData.post.allComments.abc = commentData;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <CollapsibleText
        useMarkdown
        content={mentionName}
        selector="post.allComments.abc.data.mentions.users"
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should call props onPressAudience', () => {
    const onPressAudience = jest.fn();

    const storeData = { ...initialState };

    // @ts-ignore
    storeData.post.allComments.abc = commentData;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <CollapsibleText
        useMarkdown
        content={mentionName}
        onPressAudience={onPressAudience}
        selector="post.allComments.abc.data.mentions.users"
      />,
      store,
    );

    const btnAudience = rendered.getByTestId('text_mention');
    expect(btnAudience).toBeDefined();
    fireEvent.press(btnAudience);
    expect(onPressAudience).toBeCalled();
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
