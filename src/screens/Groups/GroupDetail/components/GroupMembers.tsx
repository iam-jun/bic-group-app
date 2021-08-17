import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useKeySelector} from '~/hooks/selector';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

const GroupMembers = () => {
  const [sectionList, setSectionList] = useState([]);

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const groupId = useKeySelector('groups.groupDetail.group.id');
  const groupMember = useKeySelector('groups.groupMember');

  useEffect(() => {
    if (groupMember) {
      const newSectionList: any = [];

      Object.values(groupMember)?.map((roleData: any) => {
        const section: any = {};
        const {name, data} = roleData || {};
        if (name && data) {
          section.title = `${roleData.name} (${roleData.user_count})`;
          section.data = roleData.data;
          newSectionList.push(section);
        }
      });
      setSectionList(newSectionList);
    }
  }, [groupMember]);

  useEffect(() => {
    if (groupId) {
      dispatch(groupsActions.getGroupMembers(groupId));
    }
  }, [groupId]);

  useEffect(() => {
    dispatch(groupsActions.clearGroupMembers());
  }, []);

  const onPressUser = (userId: string) => {
    alert('onPress userId: ' + userId);
  };

  const renderItem = ({item}: any) => {
    const {id, fullname, avatar, title} = item || {};

    return (
      <PrimaryItem
        showAvatar
        style={styles.itemContainer}
        avatar={avatar}
        title={fullname}
        onPressMenu={() => onPressUser(id)}
        subTitle={title}
        subTitleProps={{variant: 'subtitle', color: colors.textSecondary}}
      />
    );
  };

  const renderListHeader = () => {
    return null;
  };

  const renderSectionHeader = ({section: {title}}: any) => {
    return (
      <View style={styles.sectionHeader}>
        <Text.H6S color={colors.textSecondary}>{title}</Text.H6S>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        style={{}}
        sections={sectionList}
        keyExtractor={(item, index) => `section_list_${item}_${index}`}
        ListHeaderComponent={renderListHeader}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{}} />}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    itemContainer: {
      height: undefined,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.tiny,
    },
    sectionHeader: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.base,
    },
  });
};

export default GroupMembers;
