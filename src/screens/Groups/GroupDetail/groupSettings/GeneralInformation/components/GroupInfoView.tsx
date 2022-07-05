import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {titleCase} from '~/utils/common';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import modalActions from '~/store/modal/actions';

interface Props {
  id: string;
  onPressPrivacy?: () => void;
}

const GroupInfoView = ({id, onPressPrivacy}: Props) => {
  const {name, description, privacy} =
    useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const can_edit_privacy = useKeySelector(
    groupsKeySelector.groupDetail.can_edit_privacy,
  );
  const can_edit_info = useKeySelector(
    groupsKeySelector.groupDetail.can_edit_info,
  );

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const {rootNavigation} = useRootNavigation();

  const editGroupDescripton = () => {
    rootNavigation.navigate(groupStack.editGroupDescription, {groupId: id});
  };

  const editGroupname = () => {
    // TODO: Add feature
    dispatch(modalActions.showAlertNewFeature());
  };

  return (
    <View style={styles.container}>
      <PrimaryItem
        testID="group_info_view.name"
        title={'settings:title_group_name'}
        titleProps={{useI18n: true}}
        subTitle={name}
        onPress={can_edit_info ? editGroupname : undefined}
        RightComponent={
          can_edit_info && (
            <Icon icon={'AngleRightB'} style={styles.rightIcon} />
          )
        }
      />

      <PrimaryItem
        testID="group_info_view.description"
        title={'settings:title_group_description'}
        titleProps={{useI18n: true}}
        subTitle={description}
        onPress={can_edit_info ? editGroupDescripton : undefined}
        RightComponent={
          can_edit_info && (
            <Icon icon={'AngleRightB'} style={styles.rightIcon} />
          )
        }
      />

      <PrimaryItem
        testID="group_info_view.privacy"
        title={'settings:title_privacy'}
        titleProps={{useI18n: true}}
        subTitle={titleCase(privacy) || ''}
        onPress={can_edit_privacy ? onPressPrivacy : undefined}
        RightComponent={
          can_edit_privacy && <Icon icon={'EditAlt'} style={styles.rightIcon} />
        }
      />
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.margin.tiny,
    },
    rightIcon: {
      marginLeft: spacing.margin.extraLarge,
    },
  });
};

export default GroupInfoView;
