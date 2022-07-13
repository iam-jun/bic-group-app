import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import i18next from 'i18next';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import {IconType} from '~/resources/icons';
import {IUserProfile} from '~/interfaces/IAuth';
import speakingLanguages from '~/constants/speakingLanguages';
import {formatDate} from '~/utils/formatData';
import genders from '~/constants/genders';
import relationshipStatus from '~/constants/relationshipStatus';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import spacing from '~/theme/spacing';

interface ProfileBlockProps {
  profileData: IUserProfile;
  onSeeMore: (item: any) => void;
  hideSeeMore: boolean;
}

const ProfileBlock = ({
  profileData,
  onSeeMore,
  hideSeeMore,
}: ProfileBlockProps) => {
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
  } = profileData;

  const theme = useTheme() as ExtendedTheme;

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
          <Icon icon={icon} tintColor={theme.colors.neutral80Light} size={20} />
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
      {!!gender || !!birthday || !!relationship_status || !!userLanguages ? (
        <>
          <Text.Subtitle color={theme.colors.gray50}>
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
        </>
      ) : null}
      {!hideSeeMore ? (
        <ButtonWrapper
          testID="user_profile.view_more"
          onPress={onSeeMore}
          activeOpacity={1}
          style={styles.buttonWrapper}>
          <Text.H6 testID="add_work.start_date" color={theme.colors.purple50}>
            {i18next.t('settings:text_view_more_info')}
          </Text.H6>
        </ButtonWrapper>
      ) : null}
      {(!!email || !!phone || !!city) && hideSeeMore ? (
        <>
          <Text.Subtitle style={styles.title} color={theme.colors.gray50}>
            {i18next.t('settings:title_contact')}
          </Text.Subtitle>

          {renderItem({icon: 'Envelope', title: email})}
          {renderItem({
            icon: 'Phone',
            TitleComponent:
              country_code && phone ? (
                <Text.BodyM> {`(+${country_code}) ${phone}`} </Text.BodyM>
              ) : null,
          })}
          {renderItem({
            icon: 'LocationPoint',
            title: city && country ? `${city}, ${country}` : undefined,
          })}
        </>
      ) : null}

      {!!latest_work && hideSeeMore ? (
        <>
          <Text.Subtitle style={styles.title} color={theme.colors.gray50}>
            {i18next.t('settings:text_work')}
          </Text.Subtitle>
          {renderItem({
            icon: 'iconSuitcase',
            TitleComponent: (
              <Text.BodyM>
                {`${latest_work?.title_position} `}
                <Text useI18n>common:text_at</Text>
                <Text.BodyM>{` ${latest_work?.company}`}</Text.BodyM>
              </Text.BodyM>
            ),
          })}
        </>
      ) : null}
    </View>
  );
};

export default ProfileBlock;

const styles = StyleSheet.create({
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
  buttonWrapper: {
    alignItems: 'flex-start',
    paddingVertical: spacing.padding.small,
  },
});
