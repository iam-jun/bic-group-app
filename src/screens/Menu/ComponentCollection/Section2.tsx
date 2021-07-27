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
import Tag from '~/beinComponents/Tag';
import TabView from '~/beinComponents/Tab';
import {IMenuItemProps} from '~/interfaces/IMenu';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import {IUser} from '~/interfaces/IAuth';

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
    const userData: IUser[] = [
      {
        id: '1',
        _id: '1',
        name: 'Name Name Name Name Name name 1',
        email: '',
        avatarUrl: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
      {
        id: '2',
        _id: '2',
        name: 'Name Name Name Name Name 2',
        email: '',
        avatarUrl: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
      {
        id: '3',
        _id: '3',
        name: 'Name Name Name Name Name 3',
        email: '',
        avatarUrl: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
      {
        id: '4',
        _id: '4',
        name: 'Name Name Name Name Name 4',
        email: '',
        avatarUrl: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
      {
        id: '5',
        _id: '5',
        name: 'Name Name Name Name Name 5',
        email: '',
        avatarUrl: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
        role: '',
      },
    ];

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
        <MentionInput
          data={userData}
          modalPosition={'bottom'}
          isMentionModalVisible={true}
          renderInput={() => (
            <SearchInput
              style={{margin: spacing?.margin.base}}
              onChangeText={(text: string) => console.log(text)}
            />
          )}
          onPress={() => alert('onPress View')}
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

  const renderTabMenuTag = () => {
    const data: IMenuItemProps[] = [
      {
        routeName: 'Love',
        label: '165',
        iconName: 'iconReactionLove',
        component: sampleScreen,
      },
      {
        routeName: 'Like',
        label: '123',
        iconName: 'iconReactionLike',
        component: sampleScreen,
      },
      {
        routeName: 'Haha',
        label: '55',
        iconName: 'iconReactionHaha',
        component: sampleScreen,
      },
      {
        routeName: 'Angry',
        label: '15',
        iconName: 'iconReactionAngry',
        component: sampleScreen,
      },
    ];

    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          Tab Menu and Tag
        </Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        <Text.H5
          style={{
            margin: spacing?.margin.base,
          }}>{`<Tag/> || <Tag.Medium/>`}</Text.H5>
        <View style={{flexDirection: 'row'}}>
          <Tag
            avatar={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
            label={'Priority'}
            selected={true}
            icon={'iconClose'}
            onPressIcon={() => alert('onPress icon')}
            onActionPress={_onActionPress}
            style={{marginStart: spacing?.margin.small}}
          />
          <Tag
            label={'Priority'}
            selected={false}
            icon={'18Plus'}
            onPressIcon={() => alert('onPress icon')}
            onActionPress={_onActionPress}
            style={{marginStart: spacing?.margin.small}}
          />
          <Tag
            label={'Priority'}
            selected={false}
            disabled
            icon={'iconClose'}
            onPressIcon={() => alert('onPress icon')}
            onActionPress={_onActionPress}
            style={{marginStart: spacing?.margin.small}}
          />
        </View>
        <Text.H5
          style={{margin: spacing?.margin.base}}>{`<Tag.Small/>`}</Text.H5>
        <View style={{flexDirection: 'row'}}>
          <Tag.Small
            avatar={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
            label={'Priority'}
            selected={true}
            icon={'Globe'}
            onPressIcon={() => alert('onPress icon')}
            onActionPress={_onActionPress}
            style={{marginStart: spacing?.margin.small}}
          />
          <Tag.Small
            label={'Priority'}
            selected={false}
            icon={'iconClose'}
            onPressIcon={() => alert('onPress icon')}
            onActionPress={_onActionPress}
            style={{marginStart: spacing?.margin.small}}
          />
          <Tag.Small
            label={'Priority'}
            selected={false}
            disabled
            icon={'iconClose'}
            onPressIcon={() => alert('onPress icon')}
            onActionPress={_onActionPress}
            style={{marginStart: spacing?.margin.small}}
          />
        </View>
        <Text.H5 style={{margin: spacing?.margin.base}}>Tab Menu</Text.H5>

        <TabView data={data} />

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
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 2</Text.H5>
      {renderBadge()}
      {renderInput()}
      {renderModals()}
      {renderTabMenuTag()}
    </View>
  );
};

export default Section2;

const sampleScreen = () => {
  return (
    <View>
      <Text>This is sample screen</Text>
    </View>
  );
};
