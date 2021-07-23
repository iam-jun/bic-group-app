import React, {useState} from 'react';
import {View} from 'react-native';
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
import Tag from '~/beinComponents/Tag';

const Section2 = () => {
  const {spacing, colors}: ITheme = useTheme();

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

  const renderTabMenuTag = () => {
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
      {renderTabMenuTag()}
    </View>
  );
};

export default Section2;
