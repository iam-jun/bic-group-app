import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import {
  Platform, View, TouchableOpacity, StyleSheet,
} from 'react-native';
import lodash from 'lodash';
import { fireEvent } from '~/test/testUtils';
import Header from '~/beinComponents/Header';

const TestComponent = ({ onChange }: {onChange?: (refs?: any) => void}) => {
  const headerRefs = React.useRef<any>();

  const onPressShowSearch = () => {
    if (typeof onChange === 'function') {
      onChange(headerRefs);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header headerRef={headerRefs} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableOpacity
          style={{ height: 40, backgroundColor: '#FF9800' }}
          testID="header.ref"
          onPress={onPressShowSearch}
        />
      </View>
    </View>
  );
};

afterEach(cleanup);

describe('Header component', () => {
  it('renders correctly', () => {
    const rendered = render(<Header />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly with children', () => {
    const rendered = render(
      <Header>
        <View testID="header.children" />
      </Header>,
    );
    const childrenComponent = rendered.getByTestId('header.children');
    expect(childrenComponent).toBeDefined();
    expect(rendered.getByTestId('header.children').type).toEqual('View');
  });

  it('renders correctly with props header ref', async () => {
    const headerRef = jest.fn();
    const rendered = render(<TestComponent onChange={headerRef} />);
    fireEvent.press(rendered.getByTestId('header.ref'));
    expect(headerRef).toBeCalledWith({
      current: {
        hideSearch: expect.any(Function),
        setSearchText: expect.any(Function),
        showSearch: expect.any(Function),
        goBack: expect.any(Function),
        setScrollY: expect.any(Function),
      },
    });
  });

  it('renders correctly with props title', () => {
    const rendered = render(<Header title="Title" />);
    const titleComponent = rendered.getByTestId('header.text');
    expect(titleComponent.props.children).toBe('Title');
  });

  it('renders correctly with props title props', () => {
    const rendered = render(
      <Header title="Title" titleTextProps={{ color: '#421187' }} />,
    );
    const titleComponent = rendered.getByTestId('header.text');
    expect(titleComponent.props.children).toBe('Title');
    const flattenedStyle = StyleSheet.flatten(titleComponent.props.style);
    expect(flattenedStyle).toMatchObject({ color: '#421187' });
  });

  it('renders correctly with props sub title', () => {
    const rendered = render(<Header subTitle="Sub Title" />);
    const subTitleComponent = rendered.getByTestId('header.subTitle');
    expect(subTitleComponent.props.children).toBe('Sub Title');
  });

  it('renders correctly with props sub title props', () => {
    const rendered = render(
      <Header subTitle="Sub Title" subTitleTextProps={{ color: '#421187' }} />,
    );
    const subTitleComponent = rendered.getByTestId('header.subTitle');
    expect(subTitleComponent.props.children).toBe('Sub Title');
    const flattenedStyle = StyleSheet.flatten(subTitleComponent.props.style);
    expect(flattenedStyle).toEqual(expect.objectContaining({ color: '#421187' }));
  });

  it('renders correctly with props left icon', () => {
    const rendered = render(<Header leftIcon="Bug" />);
    const leftIconComponent = rendered.getByTestId('header.leftIcon');
    expect(leftIconComponent).toBeDefined();
  });

  it('renders correctly with props icon', () => {
    const onPressIcon = jest.fn();
    const rendered = render(<Header icon="Bug" onPressIcon={onPressIcon} />);
    const leftIconComponent = rendered.getByTestId('header.icon');
    expect(leftIconComponent).toBeDefined();
  });

  it('renders correctly with props right icon', () => {
    const rendered = render(<Header rightIcon="Bug" />);
    const leftIconComponent = rendered.getByTestId('header.rightIcon.button');
    expect(leftIconComponent).toBeDefined();
  });

  it('renders correctly with props on press icon', () => {
    const onPressIcon = jest.fn();
    const rendered = render(<Header icon="Bug" onPressIcon={onPressIcon} />);
    const iconComponent = rendered.getByTestId('header.icon');
    expect(iconComponent).toBeDefined();
    const btnIcon = rendered.getByTestId('header.icon.button');
    expect(btnIcon).toBeDefined();
    fireEvent.press(btnIcon);
    expect(onPressIcon).toBeCalled();
  });

  it('renders correctly with props button text', () => {
    const onPressButton = jest.fn();
    const rendered = render(
      <Header buttonText="Text Button" onPressButton={onPressButton} />,
    );
    const buttonComponent = rendered.getAllByTestId('header.button');
    expect(buttonComponent).toBeDefined();
    const textButtonComponent = rendered.getByTestId('button.text');
    expect(textButtonComponent).toBeDefined();
    expect(textButtonComponent.props.children).toBe('Text Button');
  });

  it('renders correctly with props button props', () => {
    const onPressButton = jest.fn();
    const rendered = render(
      <Header
        buttonText="Text Button"
        onPressButton={onPressButton}
        buttonProps={{ style: { backgroundColor: '#F2F2F2' } }}
      />,
    );
    const buttonComponent = rendered.getAllByTestId('header.button');
    expect(buttonComponent).toBeDefined();
  });

  it('renders correctly with props on press button', async () => {
    const onPressButton = jest.fn();
    const spy = jest.spyOn(lodash, 'debounce');
    const rendered = render(
      <Header buttonText="Text Button" onPressButton={onPressButton} />,
    );
    const buttonComponent = rendered.getByTestId('header.button');
    expect(buttonComponent).toBeDefined();
    fireEvent.press(buttonComponent);

    expect(spy).toBeCalled();
  });

  it('renders correctly with props menu icon', () => {
    const onPressMenu = jest.fn();
    const rendered = render(
      <Header menuIcon="Bars" onPressMenu={onPressMenu} />,
    );
    const leftIconComponent = rendered.getByTestId('header.menuIcon.button');
    expect(leftIconComponent).toBeDefined();
  });

  it('renders correctly with props on press menu', () => {
    const onPressMenu = jest.fn();
    const rendered = render(
      <Header menuIcon="Bars" onPressMenu={onPressMenu} />,
    );
    const leftIconComponent = rendered.getByTestId('header.menuIcon.button');
    expect(leftIconComponent).toBeDefined();
    fireEvent.press(leftIconComponent);
    expect(onPressMenu).toBeCalled();
  });

  it('renders correctly with props hide back', () => {
    const rendered = render(<Header hideBack />);
    const backIcon = rendered.queryByTestId('header.back');
    expect(backIcon).toBeNull();
  });

  it('renders correctly with props on press back', () => {
    const onPressBack = jest.fn();
    const rendered = render(<Header onPressBack={onPressBack} />);
    fireEvent.press(rendered.getByTestId('header.back.button'));
    expect(onPressBack).toBeCalled();
  });

  it('renders correctly with props disable inset top', () => {
    const rendered = render(<Header disableInsetTop />);
    expect(
      rendered.getByTestId('header.content').props.style.paddingTop,
    ).toBeUndefined();
  });

  it('renders correctly with props remove border and shadow', () => {
    const rendered = render(<Header removeBorderAndShadow />);
    expect(
      rendered.getByTestId('header.content').props.style,
    ).not.toMatchObject({
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      shadowOffset: { width: 0, height: 1 },
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    });
  });

  // it('renders correctly with props auto focus search', async () => {
  //   const onSearchText = jest.fn();
  //   const rendered = render(
  //     <Header
  //       searchInputTestID="header.search.input"
  //       searchIconTestID="header.searchIcon"
  //       onSearchText={onSearchText}
  //       autoFocusSearch
  //     />,
  //   );
  //   const searchIconCopmponent = rendered.getByTestId('header.searchIcon.button');
  //   expect(searchIconCopmponent).toBeDefined();
  //   act(() => {
  //     fireEvent.press(searchIconCopmponent);
  //   });
  //   expect(rendered.getByTestId('header.search.input')).toBeDefined();
  //   expect(rendered.getByTestId('header.search.input').props.autoFocus).toBe(
  //     true,
  //   );
  // });

  // it('renders correctly with props search input test ID', async () => {
  //   const onSearchText = jest.fn();
  //   const rendered = render(
  //     <Header
  //       searchInputTestID="header.search.input"
  //       searchIconTestID="header.searchIcon"
  //       onSearchText={onSearchText}
  //     />,
  //   );
  //   const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
  //   expect(searchIconCopmponent).toBeDefined();
  //   expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
  //   act(() => {
  //     fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
  //   });
  //   expect(rendered.getByTestId('header.search.input')).toBeDefined();
  // });

  it('renders correctly with props search icon test ID', () => {
    const onSearchText = jest.fn();
    const rendered = render(
      <Header
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
      />,
    );
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
  });

  // it('renders correctly with props on focus search', async () => {
  //   const onSearchText = jest.fn();
  //   const onFocusSearch = jest.fn();
  //   const rendered = render(
  //     <Header
  //       searchInputTestID="header.search.input"
  //       searchIconTestID="header.searchIcon"
  //       onSearchText={onSearchText}
  //       onFocusSearch={onFocusSearch}
  //     />,
  //   );
  //   const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
  //   expect(searchIconCopmponent).toBeDefined();
  //   expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
  //   act(() => {
  //     fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
  //   });
  //   expect(rendered.getByTestId('header.search.input')).toBeDefined();
  //   rendered.getByTestId('header.search.input').props.onFocus();
  //   expect(onFocusSearch).toBeCalled();
  // });

  // it('renders correctly with props on submit search', async () => {
  //   const onSearchText = jest.fn();
  //   const onFocusSearch = jest.fn();
  //   const rendered = render(
  //     <Header
  //       searchInputTestID="header.search.input"
  //       searchIconTestID="header.searchIcon"
  //       onSearchText={onSearchText}
  //       onFocusSearch={onFocusSearch}
  //     />,
  //   );
  //   const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
  //   expect(searchIconCopmponent).toBeDefined();
  //   expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
  //   act(() => {
  //     fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
  //   });
  //   expect(rendered.getByTestId('header.search.input')).toBeDefined();
  //   rendered.getByTestId('header.search.input').props.onFocus();
  //   expect(onFocusSearch).toBeCalled();
  // });

  // it('renders correctly with props on show search', async () => {
  //   const onSearchText = jest.fn();
  //   const onShowSearch = jest.fn();
  //   const rendered = render(
  //     <Header
  //       searchInputTestID="header.search.input"
  //       searchIconTestID="header.searchIcon"
  //       onSearchText={onSearchText}
  //       onShowSearch={onShowSearch}
  //     />,
  //   );
  //   const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
  //   expect(searchIconCopmponent).toBeDefined();
  //   expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
  //   act(() => {
  //     fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
  //   });
  //   expect(onShowSearch).toBeCalledWith(
  //     true,
  //     expect.objectContaining({
  //       current: expect.anything(),
  //     }),
  //   );
  //   expect(rendered.getByTestId('header.search.input')).toBeDefined();
  // });

  // it('renders correctly with props on text search', async () => {
  //   const onSearchText = jest.fn();
  //   const rendered = render(
  //     <Header
  //       searchInputTestID="header.search.input"
  //       searchIconTestID="header.searchIcon"
  //       onSearchText={onSearchText}
  //     />,
  //   );
  //   const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
  //   expect(searchIconCopmponent).toBeDefined();
  //   expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
  //   act(() => {
  //     fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
  //   });
  //   expect(rendered.getByTestId('header.search.input')).toBeDefined();
  //   fireEvent.changeText(
  //     rendered.getByTestId('header.search.input'),
  //     'Text Search',
  //   );
  //   expect(onSearchText).toBeCalledWith(
  //     'Text Search',
  //     expect.objectContaining({
  //       current: expect.anything(),
  //     }),
  //   );
  // });

  // it('renders correctly with props search placeholder', async () => {
  //   const onSearchText = jest.fn();
  //   const rendered = render(
  //     <Header
  //       searchInputTestID="header.search.input"
  //       searchIconTestID="header.searchIcon"
  //       onSearchText={onSearchText}
  //       searchPlaceholder="Search Placeholder"
  //     />,
  //   );
  //   const searchIconCopmponent = rendered.getByTestId('header.searchIcon.button');
  //   expect(searchIconCopmponent).toBeDefined();
  //   act(() => {
  //     fireEvent.press(searchIconCopmponent);
  //   });
  //   expect(rendered.getByTestId('header.search.input')).toBeDefined();
  //   expect(rendered.getByTestId('header.search.input').props.placeholder).toBe(
  //     'Search Placeholder',
  //   );
  // });

  it('renders correctly with props on right press', () => {
    const onRightPress = jest.fn();
    const rendered = render(
      <Header rightIcon="menu" onRightPress={onRightPress} />,
    );
    const leftIconComponent = rendered.getByTestId('header.rightIcon.button');
    expect(leftIconComponent).toBeDefined();
    fireEvent.press(leftIconComponent);
    expect(onRightPress).toBeCalled();
  });

  it('renders correctly with props on press chat', () => {
    const onPressChat = jest.fn();
    const rendered = render(
      <Header onPressChat={onPressChat} />,
    );
    const chatIconComponent = rendered.getByTestId('header.icon_chat');
    expect(chatIconComponent).toBeDefined();
    fireEvent.press(chatIconComponent);
    expect(onPressChat).toBeCalled();
  });
});
