import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IUserWorkExperience } from '~/interfaces/IAuth';
import InfoCard from '~/components/InfoCard';
import ItemExperience from '../../components/ItemExperience';
import Divider from '~/beinComponents/Divider';
import { spacing } from '~/theme';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import AddButton from '../../components/AddButton';
import useMenuController from '~/screens/Menu/store';
import useUserProfileStore from '../../store';
import Text from '~/baseComponents/Text';

type ExperiencesProps = {
  isCurrentUser: boolean;
};

const Experiences: FC<ExperiencesProps> = ({ isCurrentUser }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { rootNavigation } = useRootNavigation();

  const menuControllerActions = useMenuController((state) => state.actions);
  const userWorkExperience = useUserProfileStore((state) => state.userWorkExperience);

  const addExperience = () => {
    menuControllerActions.setSelectedWorkItem(null);
    rootNavigation.navigate(mainStack.addWork);
  };

  const BtnAddExperience = (
    <AddButton
      isCurrentUser={isCurrentUser}
      onPress={addExperience}
      icon="PlusSolid"
      title="common:text_add"
      testID="experiences.add_btn"
    />
  );

  return (
    <View testID="experiences">
      <Divider color={colors.gray5} size={spacing.padding.large} />
      <InfoCard
        title="settings:title_experience"
        rightTitle={BtnAddExperience}
        style={styles.infoContainer}
      >
        {userWorkExperience?.length > 0 ? userWorkExperience.map((item: IUserWorkExperience, index) => (
          <View key={`${item?.id} ${item?.company}`}>
            <ItemExperience
              item={item}
              isCurrentUser={isCurrentUser}
            />
            {index !== userWorkExperience.length - 1 && (
              <Divider style={{ marginBottom: spacing.margin.large }} />
            )}
          </View>
        ))
          : (
            <Text.BodyM useI18n color={colors.neutral30}>settings:text_no_experience_to_show</Text.BodyM>
          )}
      </InfoCard>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.large,
  },
});

export default Experiences;
