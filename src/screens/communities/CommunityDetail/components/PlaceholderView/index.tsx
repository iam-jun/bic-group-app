import { StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';
import GroupProfilePlaceholder from '~/beinComponents/placeholder/GroupProfilePlaceholder';
import HeaderCreatePostPlaceholder from '~/beinComponents/placeholder/HeaderCreatePostPlaceholder';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';

interface Props {
    style?: StyleProp<ViewStyle>;
    headerStyle?: StyleProp<ViewStyle>
}

const PlaceholderView = ({ style, headerStyle }: Props) => (
  <View style={style} testID="community_detail.placeholder">
    <View>
      <GroupProfilePlaceholder disableRandom />
      <HeaderCreatePostPlaceholder style={headerStyle} />
      <PostViewPlaceholder disableRandom />
      <PostViewPlaceholder disableRandom />
    </View>
  </View>
);

export default PlaceholderView;
