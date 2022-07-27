/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';

import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import { IconType } from '~/resources/icons';
import { IUserProfile } from '~/interfaces/IAuth';
import speakingLanguages from '~/constants/speakingLanguages';
import { formatDate } from '~/utils/formatData';
import genders from '~/constants/genders';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import spacing from '~/theme/spacing';
import RELATIONSHIP_STATUS from '~/constants/relationshipStatus';

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
    countryCode,
    relationshipStatus,
    gender,
    birthday,
    latestWork,
  } = profileData;

  const theme: ExtendedTheme = useTheme();

  // @ts-ignore
  const userLanguageList = language?.map((code: string) => speakingLanguages[code].name);
  const userLanguages = userLanguageList?.join(', ');

  const renderItem = ({
    icon,
    title,
    TitleComponent,
  }: {
    icon: IconType;
    title?: string;
    TitleComponent?: React.ReactNode;
  }) => (
    (!!title || !!TitleComponent) && (
    <View style={styles.itemComponent}>
      <Icon icon={icon} tintColor={theme.colors.neutral80} size={20} />
      <Text style={styles.text} useI18n>
        {title}
      </Text>
      {TitleComponent}
    </View>
    )
  );

  return (
    <View style={styles.container}>
      {!!gender || !!birthday || !!relationshipStatus || !!userLanguages ? (
        <>
          <Text.BodyS color={theme.colors.gray50}>
            {i18next.t('settings:title_about')}
          </Text.BodyS>
          {/* @ts-ignore */}
          {gender && renderItem({ icon: 'SquareUser', title: genders[gender] })}
          {birthday
            && renderItem({
              icon: 'Calendar',
              title: formatDate(
                birthday, 'MMM Do, YYYY',
              ),
            })}
          {renderItem({ icon: 'Comments', title: userLanguages })}
          {relationshipStatus
            && renderItem({
              icon: 'Heart',
              // @ts-ignore
              title: RELATIONSHIP_STATUS[relationshipStatus],
            })}
        </>
      ) : null}
      {!hideSeeMore ? (
        <ButtonWrapper
          testID="user_profile.view_more"
          onPress={onSeeMore}
          activeOpacity={1}
          style={styles.buttonWrapper}
        >
          <Text.H6 testID="add_work.start_date" color={theme.colors.purple50}>
            {i18next.t('settings:text_view_more_info')}
          </Text.H6>
        </ButtonWrapper>
      ) : null}
      {(!!email || !!phone || !!city) && hideSeeMore ? (
        <>
          <Text.BodyS style={styles.title} color={theme.colors.gray50}>
            {i18next.t('settings:title_contact')}
          </Text.BodyS>

          {renderItem({ icon: 'Envelope', title: email })}
          {renderItem({
            icon: 'Phone',
            TitleComponent:
              countryCode && phone ? (
                <Text.BodyM>
                  {' '}
                  {`(+${countryCode}) ${phone}`}
                  {' '}
                </Text.BodyM>
              ) : null,
          })}
          {renderItem({
            icon: 'LocationDot',
            title: city && country ? `${city}, ${country}` : undefined,
          })}
        </>
      ) : null}

      {!!latestWork && hideSeeMore ? (
        <>
          <Text.BodyS style={styles.title} color={theme.colors.gray50}>
            {i18next.t('settings:text_work')}
          </Text.BodyS>
          {renderItem({
            icon: 'iconSuitcase',
            TitleComponent: (
              <Text.BodyM>
                {`${latestWork?.titlePosition} `}
                <Text useI18n>common:text_at</Text>
                <Text.BodyM>{` ${latestWork?.company}`}</Text.BodyM>
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
  text: { marginLeft: spacing.margin.base },
  title: {
    marginTop: spacing.margin.base,
  },
  buttonWrapper: {
    alignItems: 'flex-start',
    paddingVertical: spacing.padding.small,
  },
});
