import React, {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import {useDispatch} from 'react-redux';
import GroupJoinedTree from '~/screens/Groups/YourGroups/GroupJoinedTree';
import GroupJoinedList from '~/screens/Groups/YourGroups/GroupJoinedList';
import Icon from '~/beinComponents/Icon';
import modalActions from '~/store/modal/actions';
import Divider from '~/beinComponents/Divider';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useBaseHook} from '~/hooks';
import spacing from '~/theme/spacing';

export interface GroupJoinedProps {
  style?: StyleProp<ViewStyle>;
  communityId: number;
  initModeIndex?: number;
}

const menuType = [
  {
    title: 'communities:group_types:text_tree_view',
    icon: 'Sitemap',
    type: 'tree',
  },
  {
    title: 'communities:group_types:text_flat_list',
    icon: 'ListUl',
    type: 'flat',
  },
];

const GroupJoined: FC<GroupJoinedProps> = ({
  communityId,
  initModeIndex = 0,
}: GroupJoinedProps) => {
  const [selectingMode, setSelectingMode] = useState(menuType[initModeIndex]);

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ExtendedTheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const onChangeType = (item: any) => {
    setSelectingMode(item);
    dispatch(modalActions.hideModal());
  };

  const renderItem = (item: any, index: number) => {
    return (
      <PrimaryItem
        key={`view_mode_${index}`}
        height={48}
        leftIcon={item.icon as any}
        leftIconProps={{
          icon: item.icon as any,
          size: 20,
          style: {
            marginLeft: spacing.margin.tiny,
            marginRight: spacing.margin.large,
          },
        }}
        titleProps={{variant: 'h5'}}
        onPress={() => onChangeType(item)}
        title={t(item.title)}
      />
    );
  };

  const onPressShowMenu = () => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        props: {
          modalStyle: {
            borderTopRightRadius: spacing.borderRadius.base,
            borderTopLeftRadius: spacing.borderRadius.base,
          },
        },
        ContentComponent: (
          <TouchableOpacity activeOpacity={1} style={styles.container}>
            <Text.H5 style={styles.textHeader}>
              {t('communities:text_choose_view_mode')}
            </Text.H5>
            <Divider />
            {menuType?.map?.(renderItem)}
          </TouchableOpacity>
        ),
      }),
    );
  };

  const renderMenuButton = () => {
    const {icon, title} = selectingMode || {};
    return (
      <TouchableOpacity
        testID={'group_joined.btn_mode_view'}
        onPress={onPressShowMenu}
        style={styles.menuButton}>
        {!!icon && (
          <Icon icon={icon as any} style={{marginRight: spacing.margin.tiny}} />
        )}
        <Text useI18n>{title}</Text>
        <Icon icon={'AngleDown'} style={{marginLeft: spacing.margin.tiny}} />
      </TouchableOpacity>
    );
  };

  return (
    <View testID={'group_joined'} style={styles.container}>
      <View
        style={{
          zIndex: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: spacing.padding.small,
          paddingHorizontal: spacing.padding.small,
        }}>
        <Text.H5
          useI18n
          color={colors.gray50}
          style={{marginLeft: spacing.margin.small}}>
          communities:text_view_mode
        </Text.H5>
        {renderMenuButton()}
      </View>
      {selectingMode?.type === 'tree' ? (
        <GroupJoinedTree communityId={communityId} />
      ) : (
        <GroupJoinedList communityId={communityId} />
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    dataList: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.large,
    },
    textHeader: {
      marginBottom: spacing.margin.base,
      marginLeft: spacing.margin.large,
    },
    menuButton: {
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.neutral5,
      borderWidth: 1,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.tiny,
    },
  });
};

export default GroupJoined;
