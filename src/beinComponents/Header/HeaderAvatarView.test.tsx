import * as React from 'react';
import { cleanup } from '@testing-library/react-native';
import { fireEvent, renderWithRedux, configureStore } from '~/test/testUtils';
import HeaderAvatarView from '~/beinComponents/Header/HeaderAvatarView';
import initialState from '~/storeRedux/initialState';

afterEach(cleanup);

describe('Header Avatar View component', () => {
  const mockStore = configureStore([]);
  const storeData = { ...initialState };
  storeData.noInternet.isInternetReachable = true;
  const store = mockStore(storeData);

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
      store,
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
      store,
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
      store,
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
      store,
    );
    const avatarComponent = rendered.getByTestId('avatar.image');
    expect(avatarComponent).toBeDefined();
    expect(avatarComponent.props.source).toMatchObject({ uri: urlAvatar });
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
      store,
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
      store,
    );
    const HeaderAvtView = rendered.getByTestId('header_avatar_view');
    expect(HeaderAvtView).toBeDefined();
    fireEvent.press(HeaderAvtView);
    expect(onPressHeader).toBeCalled();
  });
});
