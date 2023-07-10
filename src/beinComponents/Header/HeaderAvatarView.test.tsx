import * as React from 'react';
import { cleanup } from '@testing-library/react-native';
import useNetworkStore, { INetworkState } from '~/store/network';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import HeaderAvatarView from '~/beinComponents/Header/HeaderAvatarView';

afterEach(cleanup);

describe('Header Avatar View component', () => {
  const urlAvatar
    = 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png';

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <HeaderAvatarView
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
  });

  it('renders correctly with props First Label', () => {
    const rendered = renderWithRedux(
      <HeaderAvatarView
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
    const firstLabelComponent = rendered.getByTestId(
      'header_avatar_view.first_label',
    );
    expect(firstLabelComponent).toBeDefined();
    expect(firstLabelComponent.children[0]).toMatch('First Label');
  });

  it('renders correctly with props Second Label', () => {
    const rendered = renderWithRedux(
      <HeaderAvatarView
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
    const secondLabelComponent = rendered.getByTestId(
      'header_avatar_view.second_label',
    );
    expect(secondLabelComponent).toBeDefined();
    expect(secondLabelComponent.children[0]).toMatch('Second Label');
  });

  it('renders correctly with props Avatar', () => {
    const rendered = renderWithRedux(
      <HeaderAvatarView
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
    const avatarComponent = rendered.getByTestId('avatar.image');
    expect(avatarComponent).toBeDefined();
    expect(avatarComponent.props.source).toMatchObject({ uri: `${urlAvatar}?width=128` });
  });

  it('renders correctly with props Container Style', () => {
    const rendered = renderWithRedux(
      <HeaderAvatarView
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
    const HeaderAvtView = rendered.getByTestId('header_avatar_view');
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
      <HeaderAvatarView
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        containerStyle={{
          backgroundColor: '#FF9800',
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#FFB74D',
        }}
        onPress={onPressHeader}
      />,
    );
    const HeaderAvtView = rendered.getByTestId('header_avatar_view');
    expect(HeaderAvtView).toBeDefined();
    fireEvent.press(HeaderAvtView);
    expect(onPressHeader).toBeCalled();
  });

  it('should not call onPress when cant connect to the internet', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = false;
      return state;
    });

    const onPressHeader = jest.fn();
    const rendered = renderWithRedux(
      <HeaderAvatarView
        firstLabel="First Label"
        secondLabel="Second Label"
        avatar={urlAvatar}
        containerStyle={{
          backgroundColor: '#FF9800',
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#FFB74D',
        }}
        onPress={onPressHeader}
      />,
    );
    const HeaderAvtView = rendered.getByTestId('header_avatar_view');
    expect(HeaderAvtView).toBeDefined();
    fireEvent.press(HeaderAvtView);
    expect(onPressHeader).not.toBeCalled();
  });
});
