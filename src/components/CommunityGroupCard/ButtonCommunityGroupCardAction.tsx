import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import Button from '~/beinComponents/Button';
import groupJoinStatus from '~/constants/groupJoinStatus';

type ButtonCommunityGroupCardActionProps = {
  joinStatus: typeof groupJoinStatus[keyof typeof groupJoinStatus];
  onJoin?: () => void;
  onView?: () => void;
  onCancel?: () => void;
};

const getStateButton = (
  joinStatus: typeof groupJoinStatus[keyof typeof groupJoinStatus],
  theme: ExtendedTheme,
) => {
  const { colors } = theme;
  switch (joinStatus) {
    case groupJoinStatus.unableToJoin:
      return {};
    case groupJoinStatus.requested:
      return {
        text: 'common:btn_cancel_request',
        textColor: colors.neutral70,
        backgroundColor: colors.neutral20,
      };
    case groupJoinStatus.visitor:
      return {
        text: 'common:btn_join',
        textColor: colors.white,
        backgroundColor: colors.blue50,
      };
    case groupJoinStatus.member:
      return {
        text: 'common:btn_view',
        textColor: colors.blue50,
        backgroundColor: colors.blue2,
      };
    default:
      return {
        text: 'common:btn_view',
        textColor: colors.blue50,
        backgroundColor: colors.blue2,
      };
  }
};

const ButtonCommunityGroupCardAction: FC<
  ButtonCommunityGroupCardActionProps
> = ({
  onView, onCancel, onJoin, joinStatus,
}) => {
  const theme: ExtendedTheme = useTheme();

  const stateButton = getStateButton(joinStatus, theme);

  const onPressView = () => onView?.();

  const onPressJoin = () => onJoin?.();

  const onPressCancel = () => onCancel?.();

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
        onPressView();
    }
  };

  if (!stateButton.text) {
    return null;
  }

  return (
    <Button.Primary
      useI18n
      color={stateButton.backgroundColor}
      textColor={stateButton.textColor}
      onPress={onPress}
    >
      {stateButton.text}
    </Button.Primary>
  );
};

export default ButtonCommunityGroupCardAction;
