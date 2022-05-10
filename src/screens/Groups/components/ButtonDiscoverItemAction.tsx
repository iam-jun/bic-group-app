import React, {FC} from 'react';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Button from '~/beinComponents/Button';
import icons from '~/resources/icons';
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
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  let icon, text;

  console.log(
    `\x1b[36m🐣️ ButtonDiscoverItemAction ButtonDiscoverItemAction ${joinStatus}\x1b[0m`,
  );

  switch (joinStatus) {
    case groupJoinStatus.unableToJoin:
      break;
    case groupJoinStatus.requested:
      text = 'common:btn_cancel';
      break;
    case groupJoinStatus.visitor:
      icon = icons.Plus;
      text = 'common:btn_join';
      break;
    case groupJoinStatus.member:
      text = 'common:btn_view';
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
    }
  };

  if (!text) {
    return null;
  }

  return (
    <Button.Secondary
      textVariant={'h5'}
      textColor={colors.textPrimary}
      leftIcon={icon}
      useI18n
      color={colors.bgHover}
      onPress={onPress}>
      {text}
    </Button.Secondary>
  );
};

export default ButtonDiscoverItemAction;
