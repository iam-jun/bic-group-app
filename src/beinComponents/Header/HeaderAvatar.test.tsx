import * as React from 'react';
import {cleanup} from '@testing-library/react-native';
import {fireEvent, renderWithRedux, configureStore} from '~/test/testUtils';
import HeaderAvatar from '~/beinComponents/Header/HeaderAvatar';
import initialState from '~/store/initialState';
import {StyleSheet} from 'react-native';

afterEach(cleanup);

describe('Header Avatar component', () => {
  const mockStore = configureStore([]);
  const storeData = {...initialState};
  storeData.noInternet.isInternetReachable = true;
  const store = mockStore(storeData);

  const urlAvatar =
    'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png';

  it(`renders correctly`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly with props First Label`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
      />,
      store,
    );
    const firstLabelComponent = rendered.getByTestId(
      'header_avatar.first_label',
    );
    expect(firstLabelComponent).toBeDefined();
    expect(firstLabelComponent.children[0]).toMatch('First Label');
  });

  it(`renders correctly with props First Label Props`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        firstLabelProps={{
          style: {color: '#FF9800', textDecorationLine: 'underline'},
        }}
      />,
      store,
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

  it(`renders correctly with props Icon Check Circle`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        iconCheckCircle
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const firstLabelComponent = rendered.getByTestId(
      'header_avatar.first_label',
    );
    expect(firstLabelComponent).toBeDefined();
    const iconCheckComponent = rendered.getByTestId('header_avatar.icon_check');
    expect(iconCheckComponent).toBeDefined();
  });

  it(`renders correctly with props Icon First Label`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        iconFirstLabel="UilBug"
      />,
      store,
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

  it(`renders correctly with props Icon First Label Props`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        iconFirstLabel="UilBug"
        iconFirstLabelProps={{icon: 'UilBug', tintColor: '#FF9800'}}
      />,
      store,
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
    expect(iconCheckComponent.findByType('RNSVGSvgView').props.fill).toBe(
      '#FF9800',
    );
  });

  it(`renders correctly with props Second Label`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
      />,
      store,
    );
    const secondLabelComponent = rendered.getByTestId(
      'header_avatar.second_label',
    );
    expect(secondLabelComponent).toBeDefined();
    expect(secondLabelComponent.children[0]).toMatch('Second Label');
  });

  it(`renders correctly with props Second Label Props`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        secondLabelProps={{
          style: {color: '#FF9800', textDecorationLine: 'underline'},
        }}
      />,
      store,
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

  it(`renders correctly with props Avatar`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
      />,
      store,
    );
    const imageComponent = rendered.getByTestId('avatar.image');
    expect(imageComponent).toBeDefined();
    expect(imageComponent.props.source).toMatchObject({uri: urlAvatar});
  });

  it(`renders correctly with props Avatar Props`, () => {
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        avatarProps={{
          style: {
            backgroundColor: '#FF9800',
            borderWidth: 2,
            borderColor: '#FFB74D',
          },
        }}
      />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
    const imageComponent = rendered.getByTestId('avatar.image');
    expect(imageComponent).toBeDefined();
    expect(imageComponent.props.source).toMatchObject({uri: urlAvatar});
    const avatarComponent = rendered.getByTestId('avatar');
    expect(avatarComponent).toBeDefined();
    expect(avatarComponent.props.style).toMatchObject({
      backgroundColor: '#FF9800',
      borderWidth: 2,
      borderColor: '#FFB74D',
    });
  });

  it(`renders correctly with props Container Style`, () => {
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
      store,
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

  it(`renders correctly with props On Press`, () => {
    const onPressHeader = jest.fn();
    const rendered = renderWithRedux(
      <HeaderAvatar
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        onPress={onPressHeader}
      />,
      store,
    );
    const HeaderAvatarComponent = rendered.getByTestId('header_avatar');
    expect(HeaderAvatarComponent).toBeDefined();
    fireEvent.press(HeaderAvatarComponent);
    expect(onPressHeader).toBeCalled();
  });
});
