import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Button from '~/baseComponents/Button';
import { IconType } from '~/resources/icons';

interface Props {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  isCurrentUser: boolean;
  onPress?: () => void;
  icon: IconType;
}

const EditButton = ({
  style, testID, isCurrentUser, onPress, icon,
}: Props) => {
  if (!isCurrentUser) return null;

  return (
    <Button.Secondary
      type="ghost"
      size="small"
      testID={testID}
      style={[style]}
      onPress={onPress}
      icon={icon}
    />
  );
};

export default EditButton;
