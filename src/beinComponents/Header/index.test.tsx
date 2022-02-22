import * as React from 'react';
import {render, cleanup, act} from '@testing-library/react-native';
import {fireEvent, renderWithRedux, configureStore} from '~/test/testUtils';
import {Platform, View, TouchableOpacity} from 'react-native';
import Header from '~/beinComponents/Header';
import initialState from '~/store/initialState';
import images from '~/resources/images';

const TestComponent = ({
  onShowSearch,
  onSearchText,
}: {
  onShowSearch?: (isShow: boolean, inputRef?: any) => void;
  onSearchText?: (searchText: string, inputRef?: any) => void;
}) => {
  const headerRefs = React.useRef<any>();

  const onPressShowSearch = () => {
    headerRefs.current?.showSearch();
  };

  const onPressSetSearchText = () => {
    headerRefs.current?.setSearchText('Search Text');
  };

  const onPressHideSearch = () => {
    headerRefs.current?.hideSearch();
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Header
          headerRef={headerRefs}
          searchInputTestID="header.search.input"
          onShowSearch={onShowSearch}
          onSearchText={onSearchText}
        />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            style={{height: 40, backgroundColor: '#FF9800'}}
            testID="header.ref.showSearch"
            onPress={onPressShowSearch}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{height: 40, backgroundColor: '#FF9800', marginVertical: 8}}
        testID="header.ref.setSearchText"
        onPress={onPressSetSearchText}
      />
      <TouchableOpacity
        style={{height: 40, backgroundColor: '#FF9800'}}
        testID="header.ref.hideSearch"
        onPress={onPressHideSearch}
      />
    </View>
  );
};

jest.mock('~/hooks/windowSize', () => {
  return jest.fn(() => ({
    width: 2048,
    height: 1334,
    scale: 1,
    fontScale: 1,
  }));
});

afterEach(cleanup);

describe('Header component', () => {
  const mockStore = configureStore([]);

  it(`renders correctly`, () => {
    const rendered = render(<Header />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly children`, () => {
    const rendered = render(
      <Header>
        <View testID="header.children" />
      </Header>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly children`, () => {
    const rendered = render(
      <Header>
        <View testID="header.children" />
      </Header>,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const childrenComponent = rendered.getByTestId('header.children');
    expect(childrenComponent).toBeDefined();
    expect(rendered.getByTestId('header.children').type).toEqual('View');
  });

  it(`header ref`, async () => {
    const onShowSearch = jest.fn();
    const onSearchText = jest.fn();
    const rendered = render(
      <TestComponent onShowSearch={onShowSearch} onSearchText={onSearchText} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.ref.showSearch'));
    });
    expect(onShowSearch).toBeCalledWith(
      true,
      expect.objectContaining({
        current: expect.anything(),
      }),
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.search.input')).toBeDefined();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.ref.hideSearch'));
    });
    expect(onShowSearch).toBeCalledWith(false);
    // expect(rendered.queryByTestId('header.search.input')).toBeNull();
  });

  it(`renders correctly title`, () => {
    const rendered = render(<Header title={'Title'} />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const titleComponent = rendered.getByTestId('header.text');
    expect(titleComponent.props.children).toBe('Title');
  });

  it(`renders correctly title props`, () => {
    const rendered = render(
      <Header title={'Title'} titleTextProps={{color: '#421187'}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const titleComponent = rendered.getByTestId('header.text');
    expect(titleComponent.props.children).toBe('Title');
    expect(titleComponent.props.style).toMatchObject({color: '#421187'});
  });

  it(`renders correctly sub title`, () => {
    const rendered = render(<Header subTitle="Sub Title" />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const subTitleComponent = rendered.getByTestId('header.subTitle');
    expect(subTitleComponent.props.children).toBe('Sub Title');
  });

  it(`renders correctly sub title props`, () => {
    const rendered = render(
      <Header subTitle={'Sub Title'} subTitleTextProps={{color: '#421187'}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const subTitleComponent = rendered.getByTestId('header.subTitle');
    expect(subTitleComponent.props.children).toBe('Sub Title');
    expect(subTitleComponent.props.style).toMatchObject({color: '#421187'});
  });

  it(`renders correctly avatar`, () => {
    const rendered = render(<Header avatar={images.logo_bein} />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const avatarComponent = rendered.getByTestId('avatar');
    expect(avatarComponent).toBeDefined();
    const imageComponent = rendered.getByTestId('avatar.image');
    expect(imageComponent).toBeDefined();
  });

  it(`renders correctly avatar props`, () => {
    const rendered = render(
      <Header
        avatar={images.logo_bein}
        avatarProps={{style: {borderWidth: 1, borderColor: '#FF9800'}}}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const avatarComponent = rendered.getByTestId('avatar');
    expect(avatarComponent).toBeDefined();
    const imageComponent = rendered.getByTestId('avatar.image');
    expect(imageComponent).toBeDefined();
    const avatarGroup = rendered.getByTestId('avatar_group');
    expect(avatarGroup).toBeDefined();
    expect(avatarGroup.props.style).toMatchObject({
      borderWidth: 1,
      borderColor: '#FF9800',
    });
  });

  it(`renders correctly left icon`, () => {
    const rendered = render(<Header leftIcon="UilBug" />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const leftIconComponent = rendered.getByTestId('header.leftIcon');
    expect(leftIconComponent).toBeDefined();
  });

  it(`renders correctly left icon props`, () => {
    const rendered = render(
      <Header leftIcon="UilBug" leftIconProps={{tintColor: '#421187'}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const leftIconComponent = rendered.getByTestId('header.leftIcon');
    expect(leftIconComponent).toBeDefined();
    expect(leftIconComponent.findByType('RNSVGSvgView').props.fill).toBe(
      '#421187',
    );
  });

  it(`renders correctly icon`, () => {
    const onPressIcon = jest.fn();
    const rendered = render(<Header icon="UilBug" onPressIcon={onPressIcon} />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const leftIconComponent = rendered.getByTestId('header.icon');
    expect(leftIconComponent).toBeDefined();
  });

  it(`renders correctly right icon`, () => {
    const rendered = render(<Header rightIcon="UilBug" />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const leftIconComponent = rendered.getByTestId('header.rightIcon');
    expect(leftIconComponent).toBeDefined();
  });

  it(`renders correctly right icon props`, () => {
    const rendered = render(
      <Header rightIcon="UilBug" rightIconProps={{tintColor: '#421187'}} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const leftIconComponent = rendered.getByTestId('header.rightIcon');
    expect(leftIconComponent).toBeDefined();
    expect(leftIconComponent.findByType('RNSVGSvgView').props.fill).toBe(
      '#421187',
    );
  });

  it(`on press icon`, () => {
    const onPressIcon = jest.fn();
    const rendered = render(<Header icon="UilBug" onPressIcon={onPressIcon} />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const iconComponent = rendered.getByTestId('header.icon');
    expect(iconComponent).toBeDefined();
    const btnIcon = rendered.getByTestId('header.icon.button');
    expect(btnIcon).toBeDefined();
    fireEvent.press(btnIcon);
    expect(onPressIcon).toBeCalled();
  });

  it(`renders correctly button text`, () => {
    const storeData = {...initialState};
    storeData.noInternet.isInternetReachable = true;
    const store = mockStore(storeData);
    const onPressButton = jest.fn();
    const rendered = renderWithRedux(
      <Header buttonText="Text Button" onPressButton={onPressButton} />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const buttonComponent = rendered.getAllByTestId('header.button');
    expect(buttonComponent).toBeDefined();
    const textButtonComponent = rendered.getByTestId('header.button.text');
    expect(textButtonComponent).toBeDefined();
    expect(textButtonComponent.props.children).toBe('Text Button');
  });

  it(`renders correctly button props`, () => {
    const storeData = {...initialState};
    storeData.noInternet.isInternetReachable = true;
    const store = mockStore(storeData);
    const onPressButton = jest.fn();
    const rendered = renderWithRedux(
      <Header
        buttonText="Text Button"
        onPressButton={onPressButton}
        buttonProps={{style: {backgroundColor: '#F2F2F2'}}}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const buttonComponent = rendered.getAllByTestId('header.button');
    expect(buttonComponent).toBeDefined();
    expect(rendered.getByTestId('header.button').props.style).toMatchObject({
      backgroundColor: '#F2F2F2',
    });
  });

  it(`on press button`, () => {
    const onPressButton = jest.fn();
    const storeData = {...initialState};
    storeData.noInternet.isInternetReachable = true;
    const store = mockStore(storeData);
    const rendered = renderWithRedux(
      <Header buttonText="Text Button" onPressButton={onPressButton} />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const buttonComponent = rendered.getAllByTestId('header.button');
    expect(buttonComponent).toBeDefined();
    fireEvent.press(rendered.getByTestId('header.button'));
    expect(onPressButton).toBeCalled();
  });

  it(`renders correctly menu icon`, () => {
    const onPressMenu = jest.fn();
    const rendered = render(
      <Header menuIcon="UilBars" onPressMenu={onPressMenu} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const leftIconComponent = rendered.getByTestId('header.menuIcon');
    expect(leftIconComponent).toBeDefined();
  });

  it(`on press menu`, () => {
    const onPressMenu = jest.fn();
    const rendered = render(
      <Header menuIcon="UilBars" onPressMenu={onPressMenu} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const leftIconComponent = rendered.getByTestId('header.menuIcon');
    expect(leftIconComponent).toBeDefined();
    fireEvent.press(rendered.getByTestId('header.menuIcon.button'));
    expect(onPressMenu).toBeCalled();
  });

  it(`renders correctly hide back`, () => {
    const rendered = render(<Header hideBack />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const backIcon = rendered.queryByTestId('header.back');
    expect(backIcon).toBeNull();
  });

  it(`renders correctly hide back on laptop`, () => {
    const rendered = render(<Header hideBackOnLaptop />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const backIcon = rendered.queryByTestId('header.back');
    expect(backIcon).toBeNull();
  });

  it(`on press back`, () => {
    const onPressBack = jest.fn();
    const rendered = render(<Header onPressBack={onPressBack} />);
    fireEvent.press(rendered.getByTestId('header.back.button'));
    expect(onPressBack).toBeCalled();
  });

  it(`disable inset top`, () => {
    const rendered = render(<Header disableInsetTop />);
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(
      rendered.getByTestId('header.content').props.style.paddingTop,
    ).toBeUndefined();
  });

  it(`style`, () => {
    const rendered = render(<Header style={{backgroundColor: '#F2F2F2'}} />);
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.content').props.style).toMatchObject({
      backgroundColor: '#F2F2F2',
    });
  });

  it(`remove border and shadow`, () => {
    const rendered = render(<Header removeBorderAndShadow />);
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(
      rendered.getByTestId('header.content').props.style,
    ).not.toMatchObject({
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    });
  });

  it(`auto focus search`, async () => {
    const onSearchText = jest.fn();
    const rendered = render(
      <Header
        searchInputTestID="header.search.input"
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
        autoFocusSearch
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
    });
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.search.input')).toBeDefined();
    expect(rendered.getByTestId('header.search.input').props.autoFocus).toBe(
      true,
    );
  });

  it(`search input test ID`, async () => {
    const onSearchText = jest.fn();
    const rendered = render(
      <Header
        searchInputTestID="header.search.input"
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
    });
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.search.input')).toBeDefined();
  });

  it(`search icon test ID`, () => {
    const onSearchText = jest.fn();
    const rendered = render(
      <Header
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
  });

  it(`on focus search`, async () => {
    const onSearchText = jest.fn();
    const onFocusSearch = jest.fn();
    const rendered = render(
      <Header
        searchInputTestID="header.search.input"
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
        onFocusSearch={onFocusSearch}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
    });
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.search.input')).toBeDefined();
    rendered.getByTestId('header.search.input').props.onFocus();
    expect(onFocusSearch).toBeCalled();
  });

  it(`on submit search`, async () => {
    const onSearchText = jest.fn();
    const onFocusSearch = jest.fn();
    const rendered = render(
      <Header
        searchInputTestID="header.search.input"
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
        onFocusSearch={onFocusSearch}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
    });
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.search.input')).toBeDefined();
    rendered.getByTestId('header.search.input').props.onFocus();
    expect(onFocusSearch).toBeCalled();
  });

  it(`on show search`, async () => {
    const onSearchText = jest.fn();
    const onShowSearch = jest.fn();
    const rendered = render(
      <Header
        searchInputTestID="header.search.input"
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
        onShowSearch={onShowSearch}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
    });
    expect(onShowSearch).toBeCalledWith(
      true,
      expect.objectContaining({
        current: expect.anything(),
      }),
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.search.input')).toBeDefined();
  });

  it(`on text search`, async () => {
    const onSearchText = jest.fn();
    const rendered = render(
      <Header
        searchInputTestID="header.search.input"
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
    });
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.search.input')).toBeDefined();
    fireEvent.changeText(
      rendered.getByTestId('header.search.input'),
      'Text Search',
    );
    expect(onSearchText).toBeCalledWith(
      'Text Search',
      expect.objectContaining({
        current: expect.anything(),
      }),
    );
  });

  it(`search placeholder`, async () => {
    const onSearchText = jest.fn();
    const rendered = render(
      <Header
        searchInputTestID="header.search.input"
        searchIconTestID="header.searchIcon"
        onSearchText={onSearchText}
        searchPlaceholder="Search Placeholder"
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const searchIconCopmponent = rendered.getByTestId('header.searchIcon');
    expect(searchIconCopmponent).toBeDefined();
    expect(rendered.getByTestId('header.searchIcon.button')).toBeDefined();
    act(() => {
      fireEvent.press(rendered.getByTestId('header.searchIcon.button'));
    });
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('header.search.input')).toBeDefined();
    expect(rendered.getByTestId('header.search.input').props.placeholder).toBe(
      'Search Placeholder',
    );
  });

  it(`on press header`, () => {
    const onPressHeader = jest.fn();
    const rendered = render(
      <Header avatar={images.logo_bein} onPressHeader={onPressHeader} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const headerAvatar = rendered.getByTestId('header.avatar');
    expect(headerAvatar).toBeDefined();
    fireEvent.press(headerAvatar);
    expect(onPressHeader).toBeCalled();
  });

  it(`on right press`, () => {
    const onRightPress = jest.fn();
    const rendered = render(
      <Header rightIcon="UilBug" onRightPress={onRightPress} />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const leftIconComponent = rendered.getByTestId('header.rightIcon');
    expect(leftIconComponent).toBeDefined();
    fireEvent.press(rendered.getByTestId('header.rightIcon.button'));
    expect(onRightPress).toBeCalled();
  });

  it(`on press chat`, () => {
    const onPressChat = jest.fn();
    const rendered = render(<Header onPressChat={onPressChat} />);
    expect(rendered.toJSON()).toMatchSnapshot();
    const chatIconCopmponent = rendered.getByTestId('header.iconChat');
    expect(chatIconCopmponent).toBeDefined();
    fireEvent.press(rendered.getByTestId('header.iconChat.button'));
    expect(onPressChat).toBeCalled();
  });
});
