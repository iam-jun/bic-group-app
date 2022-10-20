import React, { FC, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated, {
  Layout,
  LightSpeedInLeft,
  ZoomIn,
} from 'react-native-reanimated';
import { debounce } from 'lodash';
import Text from '~/beinComponents/Text';
import Icon from '~/baseComponents/Icon';
import { SearchInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import useGroupStructureStore from '../../store';

export interface MoveGroupTargetsProps {
  communityId: string;
  groupId: string;
  targets: any[];
  selecting?: any;
  onPressItem?: (item: any) => void;
}

const MoveGroupTargets: FC<MoveGroupTargetsProps> = ({
  communityId,
  groupId,
  targets,
  selecting,
  onPressItem,
}: MoveGroupTargetsProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const textInputRef = useRef(null);

  const groupStructureActions = useGroupStructureStore((state) => state.actions);

  const _onPressItem = (item: any) => {
    onPressItem?.(item);
    groupStructureActions.setGroupStructureMoveSelecting(item);
  };

  const onChangeSearch = debounce(
    (key: string) => {
      groupStructureActions.getGroupStructureMoveTargets({ communityId, groupId, key });
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
          onPress={() => _onPressItem(item)}
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
                <Icon icon="Check" tintColor={colors.neutral40} />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text.SubtitleL
        color={colors.neutral80}
        style={styles.titleMove}
        useI18n
      >
        communities:group_structure:text_move_to
      </Text.SubtitleL>
      <SearchInput
        inputRef={textInputRef}
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
    titleMove: {
      marginHorizontal: spacing.margin.large,
      marginBottom: spacing.margin.large,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.large,
    },
    itemContainerActive: {
      backgroundColor: colors.neutral1,
    },
    textName: {
      flex: 1,
    },
    searchInput: {
      marginBottom: spacing.margin.base,
      marginHorizontal: spacing.margin.large,
      backgroundColor: colors.white,
      borderWidth: 1,
    },
  });
};

export default MoveGroupTargets;
