import React from 'react';
import {StyleSheet} from 'react-native';
import Text from '../../Text';
import HorizontalView from '../../Layout/HorizontalView';
import Icon from '../../Icon';
import icons from '~/constants/icons';
import {useBaseHook} from '~/hooks';
import {
  blue as ACTIVE_COLOR,
  grey6 as INACTIVE_COLOR,
} from '~/theme/configs/colors';

export interface Props {
  icon?: keyof typeof icons;
  label?: string;
  isLike?: boolean;
  inactiveColor?: string;
  activeColor?: string;
}

const ReactionActionItem: React.FC<Props> = ({
  icon,
  label,
  isLike,
  inactiveColor = INACTIVE_COLOR,
  activeColor = ACTIVE_COLOR,
  ...props
}) => {
  const {t} = useBaseHook();
  const tintColor = isLike ? activeColor : inactiveColor;
  if (props.type === 'like') {
    icon = isLike ? 'iconLike' : 'iconLikeOutline';
  }

  return (
    <HorizontalView style={styles.container}>
      <Icon
        icon={icon}
        tintColor={tintColor}
        size={18}
        bold={isLike}
        style={styles.icon}
      />
      <Text
        maxBold={isLike ? true : false}
        primary={isLike ? styles.activeButton : styles.inactiveButton}>
        {t(`post:${label}`)}
      </Text>
    </HorizontalView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginEnd: 4,
  },
  activeButton: {
    color: ACTIVE_COLOR,
  },
  inactiveButton: {
    color: INACTIVE_COLOR,
  },
});

export default ReactionActionItem;
