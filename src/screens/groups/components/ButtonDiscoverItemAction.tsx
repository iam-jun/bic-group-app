import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';

import Button from '~/beinComponents/Button';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

export interface ButtonDiscoverItemActionProps {
  data: any;
  joinStatus: GroupJoinStatus;
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
    case GroupJoinStatus.UNABLE_TO_JOIN:
      break;
    case GroupJoinStatus.REQUESTED:
      text = 'common:btn_cancel';
      break;
    case GroupJoinStatus.VISITOR:
      icon = 'Plus';
      text = 'common:btn_join';
      break;
    case GroupJoinStatus.MEMBER:
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
      case GroupJoinStatus.REQUESTED:
        onPressCancel();
        break;
      case GroupJoinStatus.VISITOR:
        onPressJoin();
        break;
      case GroupJoinStatus.MEMBER:
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
