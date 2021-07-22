import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';

import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Chip from '~/beinComponents/Chip';
import {IAction} from '~/constants/commonActions';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import Divider from '~/beinComponents/Divider';
import Thread from '~/beinComponents/Badge/Thread';
import UserBadge from '~/beinComponents/Badge/UserBadge';
import Reaction from '~/beinComponents/Badge/Reaction';
import AlertModal from '~/beinComponents/modals/AlertModal';
import * as modalActions from '~/store/modal/actions';

const Section2 = () => {
  const {spacing, colors}: ITheme = useTheme();
  const dispatch = useDispatch();

  const _onActionPress = (action: IAction) => console.log('action:', action);

  const renderBadge = () => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          Badge
        </Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        <Chip
          onActionPress={_onActionPress}
          style={{margin: spacing?.margin.base}}
        />
        <Thread
          label="Learning Crypto"
          isTrending
          style={{margin: spacing?.margin.base}}
        />
        <UserBadge
          icon={'iconReactionAngry'}
          label="Coach"
          style={{margin: spacing?.margin.base}}
        />
        <View style={{flexDirection: 'row', margin: spacing?.margin.base}}>
          <Reaction
            value={1}
            selected={false}
            icon={'iconReactionAngry'}
            onActionPress={_onActionPress}
          />
          <Reaction
            value={1}
            selected={true}
            icon={'iconReactionAngry'}
            onActionPress={_onActionPress}
            style={{marginStart: spacing?.margin.small}}
          />
        </View>

        <Divider
          style={{
            margin: spacing?.margin.base,
            marginBottom: spacing?.margin.big,
          }}
        />
      </>
    );
  };

  const renderInput = () => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          Text Input
        </Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        <SearchInput
          style={{margin: spacing?.margin.large}}
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
  };

  const renderModals = () => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          Modals
        </Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        <TouchableOpacity
          onPress={() =>
            dispatch(
              modalActions.showAlert({
                title: 'Log Out',
                content: 'Do you want to log out?',
                iconName: 'SignOutAlt',
                cancelBtn: true,
                onConfirm: () => alert('Confirm button'),
              }),
            )
          }>
          <Text.H6 style={{marginHorizontal: spacing?.margin.base}}>
            Click to show modal
          </Text.H6>
        </TouchableOpacity>

        <AlertModal dismissable={true} />
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
    <View style={{flex: 1}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 2</Text.H5>
      {renderBadge()}
      {renderInput()}
      {renderModals()}
    </View>
  );
};

export default Section2;
