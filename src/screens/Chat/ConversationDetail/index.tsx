import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {useBaseHook} from '~/hooks';
import useChat from '~/hooks/chat';
import {IObject} from '~/interfaces/common';
import {IUser} from '~/interfaces/IAuth';
import {Container, Text, ViewSpacing} from '~/components';
import Divider from '~/components/Divider';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/components/Avatar';
import ListView from '~/components/list/ListView';
import ScreenWrapper from '~/components/ScreenWrapper';
import {spacing} from '~/theme';
import OptionModal, {IOptionModal} from '~/components/modals/OptionModal';
import memberOptions from '~/constants/memberOptions';

const Conversation = () => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {t, navigation} = useBaseHook();
  const {conversation} = useChat();
  const modalRef = React.useRef<IOptionModal>();
  const [selectedMember, setSelectedMember] = useState<IUser>();

  const onMemberPress = (item: IUser) => {
    setSelectedMember(item);
    modalRef.current?.open();
  };

  return (
    <ScreenWrapper testID="ConversationDetailScreen" isFullView>
      <Container style={styles.container}>
        <Icon
          style={styles.iconBack}
          icon="iconBack"
          size={16}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.top}>
          <Avatar size="big" user={{name: conversation.name}} />
          <ViewSpacing height={spacing.margin.base} />
          <Text bold h1>
            {conversation.name}
          </Text>
        </View>
        <Divider />
        <ViewSpacing height={spacing.margin.base} />
        <Text h4>{`${conversation?.members?.length} ${t(
          'chat:title_members',
        )}`}</Text>
        <ListView
          data={conversation?.members}
          type="user"
          scrollEnabled={false}
          onItemPress={onMemberPress}
        />
      </Container>
      <OptionModal
        ref={modalRef}
        optionData={memberOptions}
        headerComponent={
          <View style={styles.top}>
            <Avatar size="base" user={selectedMember} />
            <ViewSpacing height={spacing.margin.base} />
            <Text bold h4>
              {selectedMember?.name}
            </Text>
            <ViewSpacing height={spacing.margin.base} />
            <Divider />
          </View>
        }
        onOptionPress={onMemberPress}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  return StyleSheet.create({
    container: {
      marginTop: spacing.margin.big,
    },
    top: {
      alignItems: 'center',
      paddingTop: spacing.padding.large,
    },
    iconBack: {
      position: 'absolute',
      top: spacing.padding.large,
      left: spacing.padding.large,
      zIndex: 99,
    },
  });
};

export default Conversation;
