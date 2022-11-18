import { isEmpty } from 'lodash';
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

type ExperiencesProps = {
  isCurrentUser: boolean;
};

const Experiences: FC<ExperiencesProps> = ({ isCurrentUser }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { rootNavigation } = useRootNavigation();

  const menuControllerActions = useMenuController((state) => state.actions);
  const userWorkExperience = useUserProfileStore((state) => state.userWorkExperience);

  if (!isCurrentUser && isEmpty(userWorkExperience)) return null;

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
    />
  );

  return (
    <>
      <Divider color={colors.gray5} size={spacing.padding.large} />
      <InfoCard
        title="settings:title_experience"
        rightTitle={BtnAddExperience}
        style={styles.infoContainer}
      >
        {userWorkExperience.map((item: IUserWorkExperience, index) => (
          <View key={`${item?.id} ${item?.company}`}>
            <ItemExperience
              item={item}
              isCurrentUser={isCurrentUser}
            />
            {index !== userWorkExperience.length - 1 && (
              <Divider style={{ marginBottom: spacing.margin.large }} />
            )}
          </View>
        ))}
      </InfoCard>
    </>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.large,
  },
});

export default Experiences;
