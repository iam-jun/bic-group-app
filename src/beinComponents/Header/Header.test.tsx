import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import {View} from 'react-native';
import Header from '~/beinComponents/Header';

afterEach(cleanup);

describe('Header component', () => {
  it(`renders correctly`, () => {
    const rendered = render(<Header />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly children`, () => {
    const {getByTestId} = render(
      <Header>
        <View testID="header.children" />
      </Header>,
    );
    // expect(getByTestId('header.children').type).toEqual('View');
    expect(getByTestId('header.children')).toBeTruthy();
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
    const {getByTestId} = render(<Header title="Home.Test" />);
    expect(getByTestId('header.text')).toBeTruthy();
  });

  it(`renders correctly title props`, () => {
    const {getByTestId} = render(<Header />);
    const headerComponet = getByTestId('header');
    // expect().toBeTruthy();
  });

  /*
  it(`renders correctly sub title`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly sub title props`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly avatar`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly avatar props`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly `, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly left icon`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly left icon props`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly icon`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly right icon`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly right icon props`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

  it(`renders correctly on press icon`, () => {
    const {getByTestId} = render(<Header />);
    // expect(getByTestId('header').props.headerRef).toEqual('View');
  });

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
