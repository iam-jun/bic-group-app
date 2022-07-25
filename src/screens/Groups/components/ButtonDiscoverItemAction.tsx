import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';

import Button from '~/beinComponents/Button';
import groupJoinStatus from '~/constants/groupJoinStatus';

export interface ButtonDiscoverItemActionProps {
  data: any;
  joinStatus: typeof groupJoinStatus[keyof typeof groupJoinStatus];
  onJoin?: (data: any) => void;
  onView?: (data: any) => void;
  onCancel?: (data: any) => void;
}

const ButtonDiscoverItemAction: FC<ButtonDiscoverItemActionProps> = ({
  data,
  onView,
  onCancel,
  onJoin,
  joinStatus,
}: ButtonDiscoverItemActionProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  let icon; let
    text;

  switch (joinStatus) {
    case groupJoinStatus.unableToJoin:
      break;
    case groupJoinStatus.requested:
      text = 'common:btn_cancel';
      break;
    case groupJoinStatus.visitor:
      icon = 'Plus';
      text = 'common:btn_join';
      break;
    case groupJoinStatus.member:
      text = 'common:btn_view';
      break;
    default:
      break;
  }

  const onPressView = () => onView?.(data);

  const onPressJoin = () => onJoin?.(data);

  const onPressCancel = () => onCancel?.(data);

  const onPress = () => {
    switch (joinStatus) {
      case groupJoinStatus.requested:
        onPressCancel();
        break;
      case groupJoinStatus.visitor:
        onPressJoin();
        break;
      case groupJoinStatus.member:
        onPressView();
        break;
      default:
        break;
    }
  };

  if (!text) {
    return null;
  }

  return (
    <Button.Secondary
      textVariant="h5"
      textColor={colors.neutral80}
      leftIcon={icon}
      useI18n
      color={colors.neutral5}
      onPress={onPress}
    >
      {text}
    </Button.Secondary>
  );
};

export default ButtonDiscoverItemAction;
