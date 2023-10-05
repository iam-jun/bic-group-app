import React from 'react';
import { View } from 'react-native';
import CommunityItemPlaceholder, { CommunityItemPlaceholderProps } from './CommunityItemPlaceholder';

const ListCommunityPlaceHolder = ({
  shouldShowCommunityInHeader = false,
}:CommunityItemPlaceholderProps) => (
  <View testID="list_community_placeholder">
    <CommunityItemPlaceholder shouldShowCommunityInHeader={shouldShowCommunityInHeader} />
    <CommunityItemPlaceholder shouldShowCommunityInHeader={shouldShowCommunityInHeader} />
    <CommunityItemPlaceholder shouldShowCommunityInHeader={shouldShowCommunityInHeader} />
    <CommunityItemPlaceholder shouldShowCommunityInHeader={shouldShowCommunityInHeader} />

  </View>
);

export default ListCommunityPlaceHolder;
