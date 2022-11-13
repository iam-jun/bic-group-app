import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IUserWorkExperience } from '~/interfaces/IAuth';
import InfoSection from '../../components/InfoSection';
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
      <View style={styles.infoContainer}>
        <InfoSection
          title="settings:title_experience"
          rightTitle={BtnAddExperience}
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
        </InfoSection>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: spacing.padding.large,
  },
});

export default Experiences;
