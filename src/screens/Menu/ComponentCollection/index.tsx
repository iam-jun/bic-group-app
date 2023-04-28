import React from 'react';
import StorybookUIRoot from '../../../../.ondevice/Storybook';

// export default StorybookUIRoot;
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

const ComponentCollection = (): React.ReactElement => {

  return (
    <ScreenWrapper testID='ComponentCollectionScreen' isFullView>
      <Header title={'ComponentCollection'} />
      <StorybookUIRoot/>
    </ScreenWrapper>
  );
};

export default ComponentCollection;