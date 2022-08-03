import { isEmpty } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { useKeySelector } from '~/hooks/selector';
import { IUserWorkExperience } from '~/interfaces/IAuth';
import menuKeySelector from '../../../redux/keySelector';
import InfoSection from '../../components/InfoSection';
import ItemExperience from '../../components/ItemExperience';

const Experiences = () => {
  const userWorkExperience = useKeySelector(menuKeySelector.userWorkExperience);

  if (isEmpty(userWorkExperience)) return null;

  return (
    <InfoSection title="settings:title_experiences">
      {userWorkExperience.map((item: IUserWorkExperience) => (
        <View key={`${item?.id} ${item?.company}`}>
          <ItemExperience {...item} />
        </View>
      ))}
    </InfoSection>
  )
}

export default Experiences;
