import * as React from 'react';
import { cleanup } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import useNetworkStore, { INetworkState } from '~/store/network';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import HeaderAvatar from '~/beinComponents/Header/HeaderAvatar';

afterEach(cleanup);

describe('Header Avatar component', () => {
  const urlAvatar
    = 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png';

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly with props First Label', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
      />,
    );
    const firstLabelComponent = rendered.getByTestId(
      'header_avatar.first_label',
    );
    expect(firstLabelComponent).toBeDefined();
    expect(firstLabelComponent.children[0]).toMatch('First Label');
  });

  it('renders correctly with props First Label Props', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        firstLabelProps={{
          style: { color: '#FF9800', textDecorationLine: 'underline' },
        }}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const firstLabelComponent = rendered.getByTestId(
      'header_avatar.first_label',
    );
    expect(firstLabelComponent).toBeDefined();
    const flattenedStyle = StyleSheet.flatten(firstLabelComponent.props.style);
    expect(flattenedStyle).toMatchObject({
      color: '#FF9800',
      textDecorationLine: 'underline',
    });
  });

  it('renders correctly with props Icon Check Circle', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        iconCheckCircle
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const firstLabelComponent = rendered.getByTestId(
      'header_avatar.first_label',
    );
    expect(firstLabelComponent).toBeDefined();
    const iconCheckComponent = rendered.getByTestId('header_avatar.icon_check');
    expect(iconCheckComponent).toBeDefined();
  });

  it('renders correctly with props Icon First Label', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        iconFirstLabel="Bug"
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const firstLabelComponent = rendered.getByTestId(
      'header_avatar.first_label',
    );
    expect(firstLabelComponent).toBeDefined();
    const iconCheckComponent = rendered.getByTestId(
      'header_avatar.icon_first_label',
    );
    expect(iconCheckComponent).toBeDefined();
  });

  it('renders correctly with props Icon First Label Props', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        iconFirstLabel="iconClose"
        iconFirstLabelProps={{ icon: 'iconClose', tintColor: '#FF9800' }}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const firstLabelComponent = rendered.getByTestId(
      'header_avatar.first_label',
    );
    expect(firstLabelComponent).toBeDefined();
    const iconCheckComponent = rendered.getByTestId(
      'header_avatar.icon_first_label',
    );
    expect(iconCheckComponent).toBeDefined();
  });

  it('renders correctly with props Second Label', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
      />,
    );
    const secondLabelComponent = rendered.getByTestId(
      'header_avatar.second_label',
    );
    expect(secondLabelComponent).toBeDefined();
    expect(secondLabelComponent.children[0]).toMatch('Second Label');
  });

  it('renders correctly with props Second Label Props', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        secondLabelProps={{
          style: { color: '#FF9800', textDecorationLine: 'underline' },
        }}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const secondLabelComponent = rendered.getByTestId(
      'header_avatar.second_label',
    );
    const flattenedStyle = StyleSheet.flatten(secondLabelComponent.props.style);
    expect(secondLabelComponent).toBeDefined();
    expect(flattenedStyle).toMatchObject({
      color: '#FF9800',
      textDecorationLine: 'underline',
    });
  });

  it('renders correctly with props Avatar', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
      />,
    );
    const imageComponent = rendered.getByTestId('avatar.image');
    expect(imageComponent).toBeDefined();
    expect(imageComponent.props.source).toMatchObject({ uri: `${urlAvatar}?width=128` });
  });

  it('renders correctly with props Container Style', () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        containerStyle={{
          backgroundColor: '#FF9800',
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#FFB74D',
        }}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const HeaderAvtView = rendered.getByTestId('header_avatar');
    expect(HeaderAvtView).toBeDefined();
    expect(HeaderAvtView.props.style).toMatchObject({
      backgroundColor: '#FF9800',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#FFB74D',
    });
  });

  it('renders correctly with props On Press', () => {
    const onPressHeader = jest.fn();
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        onPress={onPressHeader}
      />,
    );
    const HeaderAvatarComponent = rendered.getByTestId('header_avatar');
    expect(HeaderAvatarComponent).toBeDefined();
    fireEvent.press(HeaderAvatarComponent);
    expect(onPressHeader).toBeCalled();
  });

  it('shoud not call onPress when cant connect to the internet', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = false;
      return state;
    });

    const onPressHeader = jest.fn();
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        onPress={onPressHeader}
      />,
    );
    const HeaderAvatarComponent = rendered.getByTestId('header_avatar');
    expect(HeaderAvatarComponent).toBeDefined();
    fireEvent.press(HeaderAvatarComponent);
    expect(onPressHeader).not.toBeCalled();
  });
});
