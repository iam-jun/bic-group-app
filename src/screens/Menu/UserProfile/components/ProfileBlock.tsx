import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import {IconType} from '~/resources/icons';
import {IUserProfile} from '~/interfaces/IAuth';
import speakingLanguages from '~/constants/speakingLanguages';
import {formatDate} from '~/utils/formatData';
import genders from '~/constants/genders';
import relationshipStatus from '~/constants/relationshipStatus';

const ProfileBlock = (props: IUserProfile) => {
  const {
    email,
    city,
    country,
    language,
    phone,
    country_code,
    relationship_status,
    gender,
    birthday,
    latest_work,
  } = props;
  console.log('..........props..........', props);

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const userLanguageList = language?.map(
    // @ts-ignore
    (code: string) => speakingLanguages[code].name,
  );
  const userLanguages = userLanguageList?.join(', ');

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
          <Icon icon={icon} tintColor={theme.colors.iconTintLight} size={20} />
          <Text style={styles.text} useI18n>
            {title}
          </Text>
          {TitleComponent}
        </View>
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text.Subtitle color={theme.colors.textSecondary}>
        {i18next.t('settings:title_about')}
      </Text.Subtitle>
      {/* @ts-ignore */}
      {gender && renderItem({icon: 'UserSquare', title: genders[gender]})}
      {birthday &&
        renderItem({
          icon: 'Calender',
          title: formatDate(birthday, 'MMM Do, YYYY'),
        })}
      {renderItem({icon: 'CommentsAlt', title: userLanguages})}

      {relationship_status &&
        renderItem({
          icon: 'Heart',
          // @ts-ignore
          title: relationshipStatus[relationship_status],
        })}

      <Text.Subtitle style={styles.title} color={theme.colors.textSecondary}>
        {i18next.t('settings:title_contact')}
      </Text.Subtitle>

      {renderItem({icon: 'Envelope', title: email})}
      {renderItem({
        icon: 'Phone',
        TitleComponent:
          country_code && phone ? (
            <Text.BodyM> {`(+${country_code}) ${phone}`} </Text.BodyM>
          ) : (
            {}
          ),
      })}
      {renderItem({
        icon: 'LocationPoint',
        title: city && country ? `${city}, ${country}` : undefined,
      })}

      <Text.Subtitle style={styles.title} color={theme.colors.textSecondary}>
        {i18next.t('settings:text_social')}
      </Text.Subtitle>

      <Text.Subtitle style={styles.title} color={theme.colors.textSecondary}>
        {i18next.t('settings:text_work')}
      </Text.Subtitle>
      {renderItem({
        icon: 'iconSuitcase',
        TitleComponent: latest_work && (
          <Text.BodyM>
            {`${latest_work?.title_position} `}
            <Text useI18n>common:text_at</Text>
            <Text.BodyM>{` ${latest_work?.company}`}</Text.BodyM>
          </Text.BodyM>
        ),
      })}

      <Text.Subtitle style={styles.title} color={theme.colors.textSecondary}>
        {i18next.t('settings:text_education')}
      </Text.Subtitle>
    </View>
  );
};

export default ProfileBlock;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.small,
    },
    itemComponent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.margin.small,
      marginRight: spacing.margin.base,
    },
    icon: {},
    text: {marginLeft: spacing.margin.base},
    title: {
      marginTop: spacing.margin.base,
    },
  });
};
