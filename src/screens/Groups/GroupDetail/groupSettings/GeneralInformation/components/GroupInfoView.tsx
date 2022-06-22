import {StyleSheet, View} from 'react-native';
import React from 'react';
import GroupSectionItem from '../../../components/GroupSectionItem';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {titleCase} from '~/utils/common';

interface Props {
  id: string;
  onPressPrivacy?: (e: any) => void;
}

const GroupInfoView = ({id, onPressPrivacy}: Props) => {
  const {name, description, privacy} =
    useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const can_edit_privacy = useKeySelector(
    groupsKeySelector.groupDetail.can_edit_privacy,
  );

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {rootNavigation} = useRootNavigation();

  const editGroupDescripton = () => {
    rootNavigation.navigate(groupStack.editGroupDescription, {groupId: id});
  };

  return (
    <View style={styles.container}>
      <GroupSectionItem
        testID="group_info_view.name"
        title={'settings:title_group_name'}
        subtitle={name}
        rightIcon={'AngleRightB'}
      />

      <GroupSectionItem
        testID="group_info_view.description"
        title={'settings:title_group_description'}
        subtitle={description}
        onPress={editGroupDescripton}
        rightIcon={'AngleRightB'}
      />

      {!!can_edit_privacy && (
        <GroupSectionItem
          testID="group_info_view.privacy"
          title={'settings:title_privacy'}
          subtitle={titleCase(privacy) || ''}
          rightIcon={'EditAlt'}
          onPress={onPressPrivacy}
        />
      )}
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default GroupInfoView;
