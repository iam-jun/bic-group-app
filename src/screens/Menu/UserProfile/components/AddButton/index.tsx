import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Button from '~/baseComponents/Button';
import { IconType } from '~/resources/icons';

interface Props {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  isCurrentUser: boolean;
  onPress?: () => void;
  icon?: IconType;
  title: string;
}

const AddButton = ({
  style,
  testID,
  isCurrentUser,
  onPress,
  icon,
  title,
}: Props) => {
  if (!isCurrentUser) return null;

  return (
    <Button.Primary
      size="small"
      testID={testID}
      style={[style]}
      onPress={onPress}
      icon={icon}
      useI18n
    >
      {title}
    </Button.Primary>
  );
};

export default AddButton;
