import React, {MutableRefObject, Ref} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import {Modalize} from 'react-native-modalize';
import ListView from '~/components/list/ListView';
import {IUser} from '~/interfaces/IAuth';
import Avatar from '~/components/Avatar';
import Text from '~/components/texts/Text';
import {ViewSpacing} from '~/components';
import Divider from '~/components/Divider';

export interface Props {
  modalRef?: Ref<Modalize | undefined> | MutableRefObject<Modalize | undefined>;
  onMenuPress?: Function;
  member?: IUser;
  [x: string]: any;
}

export const options = {
  DIRECT_MESSAGE: 'direct_message',
  VIEW_PROFILE: 'view_profile',
  REPORT: 'report',
};

const memberOptions = [
  {
    type: options.DIRECT_MESSAGE,
    title: 'Reply',
    icon: 'iconChat',
  },
  {
    type: options.VIEW_PROFILE,
    title: 'View profile',
    icon: 'iconUserCircle',
  },
  {
    type: options.REPORT,
    title: 'Report',
    icon: 'iconReport',
  },
];

const MemberOptions: React.FC<Props> = ({
  modalRef,
  member,
  onMenuPress,
  ...props
}) => {
  const theme: IObject<any> = useTheme();
  const styles = themeStyle(theme);

  return (
    <Modalize
      {...props}
      modalStyle={styles.modal}
      adjustToContentHeight={true}
      ref={modalRef}>
      <View style={styles.top}>
        <Avatar size="base" user={member} />
        <ViewSpacing height={spacing.margin.base} />
        <Text bold h4>
          {member?.name}
        </Text>
      </View>
      <Divider />
      <ListView
        style={styles.list}
        data={memberOptions}
        type="option"
        onItemPress={onMenuPress}
      />
    </Modalize>
  );
};

const themeStyle = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    modal: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: colors.bgColor,
    },
    top: {
      alignItems: 'center',
      paddingVertical: spacing.padding.large,
    },
    list: {
      margin: spacing.margin.base,
    },
  });
};

export default MemberOptions;
