import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';

import { IAction } from '~/constants/commonActions';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import Divider from '~/beinComponents/Divider';
import Reaction from '~/beinComponents/Badge/Reaction';
import AlertModal from '~/beinComponents/modals/AlertModal';
import * as modalActions from '~/store/modal/actions';
import Tag from '~/beinComponents/Tag';
import { IMenuItemProps } from '~/interfaces/IMenu';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import { IUser } from '~/interfaces/IAuth';
import { useBaseHook } from '~/hooks';
import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';
import spacing from '~/theme/spacing';

const Section2 = () => {
  const { colors }: ExtendedTheme = useTheme();
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const _onActionPress = (action: IAction) => console.log('action:', action);

  const renderBadge = () => (
    <>
      <Text.H3 style={{ marginHorizontal: spacing?.margin.base }}>
        Badge
      </Text.H3>
      <Divider style={{ margin: spacing?.margin.base }} />

      <View style={{ flexDirection: 'row', margin: spacing?.margin.base }}>
        <Reaction
          value={1}
          selected={false}
          icon="grinning"
          onActionPress={_onActionPress}
        />
        <Reaction
          value={1}
          selected
          icon="kissing_closed_eyes"
          onActionPress={_onActionPress}
          style={{ marginStart: spacing?.margin.small }}
        />
      </View>
      <View style={{ margin: spacing?.margin.base }}>
        <Text.H5>{'<NotificationsBadge />'}</Text.H5>
        <Text.H5>{'<NotificationsBadge.Default />'}</Text.H5>
        <Text.H5>{'<NotificationsBadge.Info/>'}</Text.H5>
        <Text.H5>{'<NotificationsBadge.Warning/>'}</Text.H5>
        <Text.H5>{'<NotificationsBadge.Alert />'}</Text.H5>
        <View style={{ flexDirection: 'row' }}>
          <NotificationsBadge
            style={{ margin: spacing?.margin.small }}
            number={10}
          />
          <NotificationsBadge.Default
            style={{ margin: spacing?.margin.small }}
            number={10}
          />
          <NotificationsBadge.Info
            style={{ margin: spacing?.margin.small }}
            number={10}
          />
          {/* <NotificationsBadge.Warning
              style={{margin: spacing?.margin.small}}
              number={10}
            /> */}
          <NotificationsBadge.Alert
            style={{ margin: spacing?.margin.small }}
            number={10}
          />
        </View>
      </View>

      <Divider
        style={{
          margin: spacing?.margin.base,
          marginBottom: spacing?.margin.big,
        }}
      />
    </>
  );

  const renderInput = () => (
    <>
      <Text.H3 style={{ marginHorizontal: spacing?.margin.base }}>
        Text Input
      </Text.H3>
      <Divider style={{ margin: spacing?.margin.base }} />
      <SearchInput
        style={{ margin: spacing?.margin.large }}
        placeholder={t('input:search')}
        onChangeText={(text: string) => console.log(text)}
      />
      <Divider
        style={{
          margin: spacing?.margin.base,
          marginBottom: spacing?.margin.big,
        }}
      />
    </>
  );

  const renderModals = () => {
    const userData: IUser[] = [
      {
        id: '1',
        name: 'Name Name Name Name Name name 1',
        email: '',
        avatar: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
      {
        id: '2',
        name: 'Name Name Name Name Name 2',
        email: '',
        avatar: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
      {
        id: '3',
        name: 'Name Name Name Name Name 3',
        email: '',
        avatar: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
      {
        id: '4',
        name: 'Name Name Name Name Name 4',
        email: '',
        avatar: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
      {
        id: '5',
        name: 'Name Name Name Name Name 5',
        email: '',
        avatar: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
    ];

    return (
      <>
        <Text.H3 style={{ marginHorizontal: spacing?.margin.base }}>
          Modals
        </Text.H3>
        <Divider style={{ margin: spacing?.margin.base }} />
        <TouchableOpacity
          onPress={() => dispatch(modalActions.showAlertNewFeature())}
        >
          <Text.H6 style={{ marginHorizontal: spacing?.margin.base }}>
            Click to show new feature modal
          </Text.H6>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => dispatch(
            modalActions.showAlert({
              title: 'Log Out',
              content: 'Do you want to log out?',
              iconName: 'ArrowRightFromArc',
              cancelBtn: true,
              onConfirm: () => alert('Confirm button'),
              confirmLabel: 'Log Out',
            }),
          )}
        >
          <Text.H6 style={{ marginHorizontal: spacing?.margin.base }}>
            Click to show modal
          </Text.H6>
        </TouchableOpacity>
        <Divider
          style={{
            margin: spacing?.margin.base,
            marginBottom: spacing?.margin.big,
          }}
        />
      </>
    );
  };


  return (
    <View style={{}}>
      <Text.H5 style={{ margin: spacing?.margin.base }}>Section 2</Text.H5>
      {renderBadge()}
      {renderInput()}
      {renderModals()}
    </View>
  );
};

export default Section2;

const sampleScreen = () => (
  <View>
    <Text>This is sample screen</Text>
  </View>
);
