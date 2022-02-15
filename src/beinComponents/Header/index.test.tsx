import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import {fireEvent} from '~/test/testUtils';
import {View} from 'react-native';
import Header from '~/beinComponents/Header';
import images from '~/resources/images';

afterEach(cleanup);

describe('Header component', () => {
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
    const {getByTestId} = render(
      <Header>
        <View testID="header.children" />
      </Header>,
    );
    const childrenComponent = getByTestId('header.children');
    expect(childrenComponent).toBeDefined();
    expect(getByTestId('header.children').type).toEqual('View');
  });

  /*
  it(`renders correctly header ref`, () => {
    const rendered = render(<Header />).toJSON();
    expect(rendered).toMatchSnapshot();
    // Should call props headerRef
    // const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });
  */

  it(`renders correctly title`, () => {
    const {getByTestId} = render(<Header title={'Title'} />);
    const titleComponent = getByTestId('header.text');
    expect(titleComponent.props.children).toBe('Title');
  });

  it(`renders correctly title props`, () => {
    const {getByTestId} = render(
      <Header title={'Title'} titleTextProps={{color: '#421187'}} />,
    );
    const titleComponent = getByTestId('header.text');
    expect(titleComponent.props.children).toBe('Title');
    expect(titleComponent.props.style.color).toBe('#421187');
  });

  it(`renders correctly sub title`, () => {
    const {getByTestId} = render(<Header subTitle="Sub Title" />);
    const subTitleComponent = getByTestId('header.subTitle');
    expect(subTitleComponent.props.children).toBe('Sub Title');
  });

  it(`renders correctly sub title props`, () => {
    const {getByTestId} = render(
      <Header subTitle={'Sub Title'} subTitleTextProps={{color: '#421187'}} />,
    );
    const subTitleComponent = getByTestId('header.subTitle');
    expect(subTitleComponent.props.children).toBe('Sub Title');
    expect(subTitleComponent.props.style.color).toBe('#421187');
  });
  /*
  it(`renders correctly avatar`, () => {
    const {getByTestId} = render(<Header avatar={images.logo_bein} />);
    const headerComponent = getByTestId('header');
    // expect(headerComponent.props.avatar).toBe(images.logo_bein);
  });
  
  it(`renders correctly avatar props`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });
  */

  it(`renders correctly left icon`, () => {
    const {getByTestId} = render(<Header leftIcon="UilBug" />);
    const leftIconComponent = getByTestId('header.leftIcon');
    expect(leftIconComponent).toBeDefined();
    expect(leftIconComponent.findByType('RNSVGSvgView')).toBeDefined();
  });

  it(`renders correctly left icon props`, () => {
    const {getByTestId} = render(
      <Header leftIcon="UilBug" leftIconProps={{tintColor: '#421187'}} />,
    );
    const leftIconComponent = getByTestId('header.leftIcon');
    expect(leftIconComponent).toBeDefined();
    expect(leftIconComponent.findByType('RNSVGSvgView').props.fill).toBe(
      '#421187',
    );
  });

  it(`renders correctly icon`, () => {
    const onPressIcon = jest.fn();
    const {getByTestId} = render(
      <Header icon="UilBug" onPressIcon={onPressIcon} />,
    );
    const leftIconComponent = getByTestId('header.icon');
    expect(leftIconComponent).toBeDefined();
    expect(leftIconComponent.findByType('RNSVGSvgView')).toBeDefined();
  });

  it(`renders correctly right icon`, () => {
    const {getByTestId} = render(<Header rightIcon="UilBug" />);
    const leftIconComponent = getByTestId('header.rightIcon');
    expect(leftIconComponent).toBeDefined();
    expect(leftIconComponent.findByType('RNSVGSvgView')).toBeDefined();
  });

  it(`renders correctly right icon props`, () => {
    const {getByTestId} = render(
      <Header rightIcon="UilBug" rightIconProps={{tintColor: '#421187'}} />,
    );
    const leftIconComponent = getByTestId('header.rightIcon');
    expect(leftIconComponent).toBeDefined();
    expect(leftIconComponent.findByType('RNSVGSvgView').props.fill).toBe(
      '#421187',
    );
  });

  it(`renders correctly on press icon`, () => {
    const onPressIcon = jest.fn();
    const rendered = render(<Header icon="UilBug" onPressIcon={onPressIcon} />);
    const iconComponent = rendered.getByTestId('header.icon');
    expect(iconComponent).toBeDefined();
    expect(iconComponent.findByType('RNSVGSvgView')).toBeDefined();
    const btnIcon = rendered.getByTestId('header.icon.button');
    expect(btnIcon).toBeDefined();
    fireEvent.press(btnIcon);
    expect(onPressIcon).toBeCalled();
  });
  /*
  it(`renders correctly button variant`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly button text`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly button props`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on press button`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly menu icon`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on press menu`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly hide back`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly hide bacck on laptop`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on press back`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly disable inset top`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly style`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly remove border and shadow`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly auto focus search`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly search input test ID`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly search icon test ID`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on focus search`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on submit search`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on show search`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on text search`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly search placeholder`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on press header`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on right press`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on right chat`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });
  */
});
