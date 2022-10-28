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

const DeleteButton = ({
  style, testID, isCurrentUser, onPress, icon,
}: Props) => {
  if (!isCurrentUser) return null;

  return (
    <Button.Danger
      testID={testID}
      style={[style]}
      type="ghost"
      size="small"
      icon={icon}
      onPress={onPress}
    />
  );
};

export default DeleteButton;
