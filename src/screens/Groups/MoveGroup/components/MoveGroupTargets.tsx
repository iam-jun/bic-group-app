import React, {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Animated, {Layout, LightSpeedInLeft} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';

export interface MoveGroupTargetsProps {
  style?: StyleProp<ViewStyle>;
  targets: any[];
  selecting?: any;
}

const MoveGroupTargets: FC<MoveGroupTargetsProps> = ({
  style,
  targets,
  selecting,
}: MoveGroupTargetsProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const onPressItem = (item: any) => {
    dispatch(groupsActions.setGroupStructureMoveSelecting(item));
  };

  const renderItem = (item: any, index: number) => {
    const isActive = selecting?.id === item?.id;
    return (
      <Animated.View entering={LightSpeedInLeft} layout={Layout.springify()}>
        <TouchableOpacity
          style={[
            styles.itemContainer,
            isActive ? styles.itemContainerActive : {},
          ]}
          onPress={() => onPressItem(item)}>
          <Text variant={isActive ? 'bodySM' : 'bodyS'} numberOfLines={2}>
            {item?.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text.H5
        style={{
          marginHorizontal: spacing.margin.extraLarge,
          marginBottom: spacing.margin.small,
        }}
        useI18n>
        communities:group_structure:text_move_to
      </Text.H5>
      <Animated.View>{targets?.map?.(renderItem)}</Animated.View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
      paddingVertical: spacing.padding.large,
    },
    itemContainerActive: {
      backgroundColor: colors.bgSecondary,
    },
  });
};

export default MoveGroupTargets;
