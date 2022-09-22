import React, { FC } from 'react';
import Button, { ButtonProps } from '~/baseComponents/Button';
import groupJoinStatus from '~/constants/groupJoinStatus';

interface ButtonActionProps extends ButtonProps {
  joinStatus: typeof groupJoinStatus[keyof typeof groupJoinStatus];
  onPress: () => void;
}

interface ButtonDiscoverProps extends ButtonProps {
  joinStatus: typeof groupJoinStatus[keyof typeof groupJoinStatus];
  onJoin?: () => void;
  onView?: () => void;
  onCancel?: () => void;
}

const getTextButton = (
  joinStatus: typeof groupJoinStatus[keyof typeof groupJoinStatus],
) => {
  switch (joinStatus) {
    case groupJoinStatus.unableToJoin:
      return '';
    case groupJoinStatus.requested:
      return 'common:btn_cancel_request';
    case groupJoinStatus.visitor:
      return 'common:btn_join';
    case groupJoinStatus.member:
      return 'common:btn_view';
    default:
      return 'common:btn_view';
  }
};

const ButtonAction: FC<ButtonActionProps> = ({ joinStatus, ...props }) => {
  const textButton = getTextButton(joinStatus);

  switch (joinStatus) {
    case groupJoinStatus.unableToJoin:
      return null;
    case groupJoinStatus.requested:
      return (
        <Button.Neutral
          useI18n
          {...props}
        >
          {textButton}
        </Button.Neutral>
      );
    case groupJoinStatus.visitor:
      return (
        <Button.Secondary
          useI18n
          {...props}
        >
          {textButton}
        </Button.Secondary>
      );
    case groupJoinStatus.member:
      return (
        <Button.Secondary
          type="ghost"
          useI18n
          {...props}
        >
          {textButton}
        </Button.Secondary>
      );
    default:
      return (
        <Button.Secondary
          type="ghost"
          useI18n
          {...props}
        >
          {textButton}
        </Button.Secondary>
      );
  }
};

const ButtonDiscover: FC<
ButtonDiscoverProps
> = ({
  onView, onCancel, onJoin, joinStatus, ...props
}) => {
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

  return (
    <ButtonAction joinStatus={joinStatus} {...props} onPress={onPress} />
  );
};

export default ButtonDiscover;
