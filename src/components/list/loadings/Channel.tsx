import React from 'react';
import {View} from 'react-native';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';
import Text from '../../texts/Text';
import ViewSpacing from '../../ViewSpacing';

const Channel = () => (
  <Placeholder
    Animation={Fade}
    style={{
      marginVertical: 6,
      marginHorizontal: 15,
      borderRadius: 4,
    }}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text bold h3 h3Style={{color: 'grey'}}>
        {'# '}
      </Text>
      <PlaceholderLine style={{marginTop: 1}} width={70} />
    </View>
  </Placeholder>
);

export default Channel;
