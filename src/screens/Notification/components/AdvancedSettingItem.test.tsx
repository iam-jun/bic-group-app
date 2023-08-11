import React from 'react';

import { fireEvent, renderWithRedux, languages } from '~/test/testUtils';
import AdvancedSettingItem from './AdvancedSettingItem';
import useAdvancedNotiSettingsStore from '../AdvancedSettings/store';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';

describe('Notification Advanced Setting Item Component', () => {
  const mockItemData: any = {
    id: 'e41f5eb6-1697-4438-9230-2584ccbcdae8',
    name: 'Frontend-Web',
    slug: 'frontend-web',
    icon: 'https://media.beincom.app/image/variants/group/avatar/022396d4-eeab-47aa-a1fb-f467e9b33005',
    level: 4,
    privacy: 'OPEN',
    parents: [
      'e05d0e4f-5ab0-4409-8f05-97ef2916d348',
      'fd7c3ef9-ae9b-4331-9324-1b709e4685b6',
      '84a8bb23-7759-48ec-9fa5-0ab2891e924a',
      '14626035-79bd-4d14-bcf0-ed324855e12c',
    ],
    parentId: '14626035-79bd-4d14-bcf0-ed324855e12c',
    createdAt: '2022-05-19T08:47:28.003Z',
    updatedAt: '2023-04-20T07:04:31.849Z',
    description: '',
    communityId: '4343060d-93c9-4039-90c1-afc0e7e479ea',
    backgroundImgUrl: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
    userCount: 65,
  };

  const mockCommunitySelected: any = {
    id: mockItemData.communityId,
    enable: true,
  };

  it('should render correctly and call prop onPress', () => {
    const onPressItem = jest.fn();
    useSearchJoinedCommunitiesStore.setState((state) => {
      state.items = {
        [mockItemData.id]: mockItemData,
      };
      return state;
    });
    useAdvancedNotiSettingsStore.setState((state) => {
      state.selectedCommunity = mockItemData;
      state.communityData = {
        [mockItemData.communityId]: {
          enable: true,
        },
      } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <AdvancedSettingItem
        type="community"
        item={mockItemData.id}
        onPress={onPressItem}
      />,
    );

    const itemComponent = wrapper.getByTestId('notification_advanced_setting_item');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);

    expect(onPressItem).toBeCalled();
  });

  it('should render correctly with isDisable = true', () => {
    const onPressItem = jest.fn();
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingGroupSettings = false;
      state.selectedCommunity = mockCommunitySelected;
      state.groupData = {
        [mockItemData.id]: {
          setting: {
            flag: { value: false },
            channels: {
              inApp: true, push: true,
            },
            enable: true,
          },
        },
      } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <AdvancedSettingItem
        item={mockItemData.id}
        onPress={onPressItem}
      />,
    );

    const itemComponent = wrapper.getByTestId('notification_advanced_setting_item');
    expect(itemComponent).toBeDefined();

    const disableView = wrapper.getByTestId('notification_advanced_setting_item.disable_view');
    expect(disableView).toBeDefined();

    const labelComponent = wrapper.getByTestId('notification_advanced_setting_item.label');
    expect(labelComponent).toBeDefined();
    expect(labelComponent.props.children).toBe(languages.notification.notification_settings.default_text);

    fireEvent.press(itemComponent);

    expect(onPressItem).not.toBeCalled();
  });

  it('should render correctly when type of item is push', () => {
    const onPressItem = jest.fn();
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingGroupSettings = false;
      state.groupData = {
        [mockItemData.id]: {
          setting: {
            flag: { value: true },
            channels: {
              inApp: false,
              push: true,
            },
            enable: true,
          },
        },
      } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <AdvancedSettingItem
        item={mockItemData.id}
        onPress={onPressItem}
      />,
    );

    const itemComponent = wrapper.getByTestId('notification_advanced_setting_item');
    expect(itemComponent).toBeDefined();

    const labelComponent = wrapper.getByTestId('notification_advanced_setting_item.label');
    expect(labelComponent).toBeDefined();
    expect(labelComponent.props.children).toBe(languages.notification.notification_settings.push_text);
  });

  it('should render correctly when type of item is in-app', () => {
    const onPressItem = jest.fn();
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingGroupSettings = false;
      state.groupData = {
        [mockItemData.id]: {
          setting: {
            flag: { value: true },
            channels: {
              inApp: true,
              push: false,
            },
            enable: true,
          },
        },
      } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <AdvancedSettingItem
        item={mockItemData.id}
        onPress={onPressItem}
      />,
    );

    const itemComponent = wrapper.getByTestId('notification_advanced_setting_item');
    expect(itemComponent).toBeDefined();

    const labelComponent = wrapper.getByTestId('notification_advanced_setting_item.label');
    expect(labelComponent).toBeDefined();
    expect(labelComponent.props.children).toBe(languages.notification.notification_settings.in_app_text);
  });

  it('should render correctly when type of item is in-app and push', () => {
    const onPressItem = jest.fn();
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingGroupSettings = false;
      state.groupData = {
        [mockItemData.id]: {
          setting: {
            flag: { value: true },
            channels: {
              inApp: true,
              push: true,
            },
            enable: true,
          },
        },
      } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <AdvancedSettingItem
        item={mockItemData.id}
        onPress={onPressItem}
      />,
    );

    const itemComponent = wrapper.getByTestId('notification_advanced_setting_item');
    expect(itemComponent).toBeDefined();

    const labelComponent = wrapper.getByTestId('notification_advanced_setting_item.label');
    expect(labelComponent).toBeDefined();
    // eslint-disable-next-line max-len
    const expectText = `${languages.notification.notification_settings.in_app_text}, ${languages.notification.notification_settings.push_text}`;
    expect(labelComponent.props.children).toBe(expectText);
  });

  it('should render correctly when type of item is Off', () => {
    const onPressItem = jest.fn();
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingGroupSettings = false;
      state.groupData = {
        [mockItemData.id]: {
          setting: {
            flag: { value: true },
            channels: {
              inApp: false,
              push: false,
            },
            enable: false,
          },
        },
      } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <AdvancedSettingItem
        item={mockItemData.id}
        onPress={onPressItem}
      />,
    );

    const itemComponent = wrapper.getByTestId('notification_advanced_setting_item');
    expect(itemComponent).toBeDefined();

    const labelComponent = wrapper.getByTestId('notification_advanced_setting_item.label');
    expect(labelComponent).toBeDefined();
    expect(labelComponent.props.children).toBe(languages.notification.notification_settings.off_text);
  });
});
