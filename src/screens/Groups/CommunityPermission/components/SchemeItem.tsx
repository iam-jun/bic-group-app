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

  const {name, applyingGroups} = item;
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
        <Button style={styles.buttonEdit} onPress={onPressEdit}>
          <Icon size={16} icon={'EditAlt'} />
        </Button>
        <Button style={styles.buttonDelete} onPress={onPressDelete}>
          <Icon size={16} tintColor={colors.badgeError} icon={'TrashAlt'} />
        </Button>
      </View>
    );
  };

  const renderItem = (item: IApplyingGroups, index: number) => {
    return (
      <View key={index} style={styles.nameTag}>
        <Text.BodyS maxLength={16}>{item.name}</Text.BodyS>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.BodyM>{name}</Text.BodyM>
          {isActivated && (
            <TextBadge
              useI18n
              value={'common:text_activated'}
              style={styles.activatedText}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>{renderButtons()}</View>
      </View>

      {applyingGroups?.length > 0 && (
        <View style={styles.groupListView}>
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
      alignItems: 'center',
      marginBottom: spacing.margin.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
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
    buttonContainer: {minHeight: 30, justifyContent: 'center'},
    activatedText: {
      marginHorizontal: spacing.margin.small,
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
  });
};

export default SchemeItem;
