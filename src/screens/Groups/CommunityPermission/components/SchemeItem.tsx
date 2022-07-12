import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import TextBadge from '~/beinComponents/Badge/TextBadge';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import modalActions from '~/store/modal/actions';
import {IApplyingGroups, IGroupScheme} from '~/interfaces/IGroup';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

interface SchemeItemProps {
  item: IGroupScheme;
}

const SchemeItem = ({item}: SchemeItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const {colors} = theme;
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const {name, description, applyingGroups} = item;
  const isActivated = applyingGroups?.length > 0;

  const onPressEdit = () => {
    rootNavigation.navigate(groupStack.createPermissionScheme, {
      isEdit: true,
      initScheme: item,
      schemeId: item.id,
    });
  };

  const onPressDelete = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const renderButtons = () => {
    return (
      <View style={styles.row}>
        <Button
          style={styles.buttonEdit}
          onPress={onPressEdit}
          testID="scheme_item.btn_edit">
          <Icon size={16} icon={'PenLine'} />
        </Button>
        <Button
          style={styles.buttonDelete}
          onPress={onPressDelete}
          testID="scheme_item.btn_delete">
          <Icon size={16} tintColor={colors.badgeError} icon={'TrashCan'} />
        </Button>
      </View>
    );
  };

  const renderItem = (item: IApplyingGroups) => {
    return (
      <View key={item.id} style={styles.nameTag} testID="scheme_item.group_tag">
        <Text.Subtitle>{item.name}</Text.Subtitle>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.BodySM
            numberOfLines={3}
            style={styles.flex1}
            testID="scheme_item.name">
            {name}
          </Text.BodySM>
          {isActivated && (
            <TextBadge
              useI18n
              value={'common:text_activated'}
              style={styles.activatedText}
            />
          )}
        </View>
        {renderButtons()}
      </View>
      {!!description && (
        <Text.Subtitle style={styles.textDesc}>{description}</Text.Subtitle>
      )}
      {applyingGroups?.length > 0 && (
        <View testID="scheme_item.group_list" style={styles.groupListView}>
          {applyingGroups?.map?.(renderItem)}
        </View>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    titleContainer: {
      flexDirection: 'row',
      marginBottom: spacing.margin.small,
      // alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    buttonEdit: {
      backgroundColor: colors.bgHover,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.tiny,
    },
    buttonDelete: {
      backgroundColor: colors.bgError,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.tiny,
      marginLeft: spacing.margin.small,
    },
    activatedText: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.small,
    },
    nameTag: {
      backgroundColor: colors.bgHover,
      borderRadius: 50,
      alignItems: 'center',
      paddingVertical: 2,
      paddingHorizontal: spacing.padding.tiny,
      alignSelf: 'baseline',
      marginRight: spacing.margin.tiny,
      marginBottom: spacing.margin.small,
    },
    groupListView: {
      marginBottom: spacing.margin.tiny,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    textDesc: {
      marginBottom: spacing.margin.small,
    },
  });
};

export default SchemeItem;
