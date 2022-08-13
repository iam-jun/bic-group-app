import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated, {
  Layout,
  LightSpeedInLeft,
  ZoomIn,
} from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import Text from '~/beinComponents/Text';
import groupsActions from '~/storeRedux/groups/actions';
import Icon from '~/beinComponents/Icon';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';

export interface MoveGroupTargetsProps {
  communityId: string;
  groupId: string;
  targets: any[];
  selecting?: any;
}

const MoveGroupTargets: FC<MoveGroupTargetsProps> = ({
  communityId,
  groupId,
  targets,
  selecting,
}: MoveGroupTargetsProps) => {
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const onPressItem = (item: any) => {
    dispatch(groupsActions.setGroupStructureMoveSelecting(item));
  };

  const onChangeSearch = debounce(
    (key: string) => {
      dispatch(groupsActions.getGroupStructureMoveTargets({ communityId, groupId, key }));
    }, 300,
  );

  const renderItem = (item: any) => {
    const isActive = selecting?.id === item?.id;
    return (
      <Animated.View key={`move_group_target_${item?.id}`} entering={LightSpeedInLeft} layout={Layout.springify()}>
        <TouchableOpacity
          style={[
            styles.itemContainer,
            isActive ? styles.itemContainerActive : {},
          ]}
          onPress={() => onPressItem(item)}
        >
          <Text
            style={styles.textName}
            variant={isActive ? 'bodySMedium' : 'bodyS'}
            numberOfLines={2}
          >
            {item?.name}
          </Text>
          <View style={{ minWidth: 20, minHeight: 20 }}>
            {isActive && (
              <Animated.View entering={ZoomIn}>
                <Icon icon="Check" tintColor={colors.purple50} />
              </Animated.View>
            )}
          </View>
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
        useI18n
      >
        communities:group_structure:text_move_to
      </Text.H5>
      <SearchInput
        style={styles.searchInput}
        onChangeText={onChangeSearch}
        placeholder={t('communities:group_structure:text_move_group_search_placeholder')}
      />
      <Animated.View>{targets?.map?.(renderItem)}</Animated.View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.extraLarge,
      paddingVertical: spacing.padding.large,
    },
    itemContainerActive: {
      backgroundColor: colors.neutral1,
    },
    textName: {
      flex: 1,
    },
    searchInput: {
      marginBottom: spacing.margin.base,
      marginHorizontal: spacing.margin.base,
      backgroundColor: colors.white,
      borderColor: colors.purple50,
      borderWidth: 1,
    },
  });
};

export default MoveGroupTargets;
