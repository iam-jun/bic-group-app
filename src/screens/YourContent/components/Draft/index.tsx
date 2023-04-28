import { StyleSheet, View } from 'react-native';
import React from 'react';

import DraftPost from '~/screens/YourContent/components/Draft/DraftPost';
import DraftArticle from '~/screens/YourContent/components/Draft/DraftArticle';
import useYourContentStore from '../../store';
import DraftContents from './DraftContents';

interface DraftProps {
  onScroll: (e: any) => void;
}

const Draft: React.FC<DraftProps> = ({ onScroll }) => {
  const { activeDraftTab } = useYourContentStore((state) => state);

  const styles = createStyles();

  const renderContent = () => {
    if (activeDraftTab === 0) {
      return <DraftContents onScroll={onScroll} />;
    }
    if (activeDraftTab === 1) {
      return <DraftPost onScroll={onScroll} />;
    }

    if (activeDraftTab === 2) {
      return <DraftArticle onScroll={onScroll} />;
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Draft;
