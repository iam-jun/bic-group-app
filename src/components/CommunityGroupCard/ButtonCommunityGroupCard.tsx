import React, { FC } from 'react';
import Button, { ButtonProps } from '~/baseComponents/Button';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

interface ButtonActionProps extends ButtonProps {
  joinStatus:GroupJoinStatus;
  onPress: () => void;
}

interface ButtonCommunityGroupCardProps extends ButtonProps {
  joinStatus: GroupJoinStatus;
  onJoin?: () => void;
  onView?: () => void;
  onCancel?: () => void;
}

const getTextButton = (
  joinStatus: GroupJoinStatus,
) => {
  switch (joinStatus) {
    case GroupJoinStatus.UNABLE_TO_JOIN:
      return '';
    case GroupJoinStatus.REQUESTED:
      return 'common:btn_cancel_request';
    case GroupJoinStatus.VISITOR:
      return 'common:btn_join';
    case GroupJoinStatus.MEMBER:
      return 'common:btn_view';
    default:
      return 'common:btn_view';
  }
};

const ButtonAction: FC<ButtonActionProps> = ({ joinStatus, ...props }) => {
  const textButton = getTextButton(joinStatus);

  switch (joinStatus) {
    case GroupJoinStatus.UNABLE_TO_JOIN:
      return null;
    case GroupJoinStatus.REQUESTED:
      return (
        <Button.Neutral
          useI18n
          {...props}
        >
          {textButton}
        </Button.Neutral>
      );
    case GroupJoinStatus.VISITOR:
      return (
        <Button.Secondary
          useI18n
          {...props}
        >
          {textButton}
        </Button.Secondary>
      );
    case GroupJoinStatus.MEMBER:
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

const ButtonCommunityGroupCard: FC<
ButtonCommunityGroupCardProps
> = ({
  onView, onCancel, onJoin, joinStatus, ...props
}) => {
  const onPressView = () => onView?.();

  const onPressJoin = () => onJoin?.();

  const onPressCancel = () => onCancel?.();

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
        onPressView();
    }
  };

  return (
    <ButtonAction joinStatus={joinStatus} {...props} onPress={onPress} />
  );
};

export default ButtonCommunityGroupCard;
