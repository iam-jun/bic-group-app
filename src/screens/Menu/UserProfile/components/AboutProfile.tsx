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

const AboutProfile = (props: IUserProfile) => {
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
    <View style={styles.container}>
      <Text.ButtonBase style={styles.about}>
        {i18next.t('settings:title_about')}
      </Text.ButtonBase>
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
      {renderItem({
        icon: 'LocationPoint',
        title: city && country ? `${city}, ${country}` : undefined,
      })}
      {renderItem({icon: 'CommentsAlt', title: userLanguages})}
      {birthday &&
        renderItem({
          icon: 'Calender',
          title: formatDate(birthday, 'MMM Do, YYYY'),
        })}
      {renderItem({
        icon: 'Phone',
        title:
          country_code && phone ? `(+${country_code}) ${phone}` : undefined,
      })}
      {renderItem({icon: 'Envelope', title: email})}
      {/* @ts-ignore */}
      {gender && renderItem({icon: 'UserSquare', title: genders[gender]})}
      {relationship_status &&
        renderItem({
          icon: 'Heart',
          // @ts-ignore
          title: relationshipStatus[relationship_status],
        })}
    </View>
  );
};

export default AboutProfile;

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
      marginBottom: spacing.margin.small,
      marginRight: spacing.margin.base,
    },
    about: {
      marginBottom: spacing.margin.base,
    },
    icon: {},
    text: {marginLeft: spacing.margin.large},
  });
};
