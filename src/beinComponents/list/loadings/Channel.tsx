import React from 'react';
import { View } from 'react-native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import Text from '~/baseComponents/Text';

const Channel = () => (
  <Placeholder
    Animation={Fade}
    style={{
      marginVertical: 6,
      marginHorizontal: 15,
      borderRadius: 4,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text variant="bodyM" style={{ color: 'grey' }}>
        {'# '}
      </Text>
      <PlaceholderLine style={{ marginTop: 1 }} width={70} />
    </View>
  </Placeholder>
);

export default Channel;
