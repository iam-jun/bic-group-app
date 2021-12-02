import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import Avatar from '~/beinComponents/Avatar';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';
import Divider from '~/beinComponents/Divider';

const PendingUserItem = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const renderItem = ({
    icon,
    title,
    TitleComponent,
  }: {
    icon: IconType;
    title?: string;
    TitleComponent?: React.ReactNode;
  }) => {
    return (
      (!!title || !!TitleComponent) && (
        <View style={styles.itemComponent}>
          <Icon icon={icon} tintColor={theme.colors.primary5} size={24} />
          <Text.Body style={styles.text} useI18n>
            {title}
          </Text.Body>
          {TitleComponent}
        </View>
      )
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <Avatar.Large
          source={
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/990c8cba-cdb0-4704-848c-4752e0e65ae3.jpg'
          }
        />
        <View style={styles.textHeader}>
          <Text.ButtonBase>Huỳnh Khanh</Text.ButtonBase>
          <Text.Body color={theme.colors.textSecondary}>
            Requested 3 minutes ago
          </Text.Body>
        </View>
      </View>

      <View style={styles.aboutProfile}>
        {renderItem({
          icon: 'iconSuitcase',
          title: 'Designer at EVOL GROUP',
        })}
        {renderItem({
          icon: 'LocationPoint',
          title: 'TP.HCM',
        })}
        {renderItem({icon: 'Envelope', title: 'phuongkhanh@evolgroup.vn'})}
      </View>

      <View style={styles.buttons}>
        <Button.Secondary
          style={styles.buttonDecline}
          onPress={() => alert('onPress')}>
          Decline
        </Button.Secondary>
        <Button.Secondary
          highEmphasis
          style={styles.buttonApprove}
          color={theme.colors.primary6}
          onPress={() => alert('onPress')}>
          Approve
        </Button.Secondary>
      </View>
      <Divider />
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    header: {
      flexDirection: 'row',
    },
    textHeader: {
      marginLeft: spacing.margin.base,
      justifyContent: 'center',
    },
    itemComponent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.small,
      marginRight: spacing.margin.base,
    },
    text: {
      marginLeft: spacing.margin.large,
    },
    aboutProfile: {
      marginTop: spacing.margin.large,
    },
    buttons: {
      flexDirection: 'row',
      marginVertical: spacing.margin.small,
    },
    buttonDecline: {
      flex: 1,
      marginRight: spacing.margin.small,
    },
    buttonApprove: {
      flex: 1,
    },
  });
};

export default PendingUserItem;
