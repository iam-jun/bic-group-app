import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, RefreshControl } from 'react-native';
import Animated from 'react-native-reanimated';
import dimension, { homeHeaderTabHeight, homeHeaderContentContainerHeight } from '~/theme/dimension';

const HeaderFilterHeight = homeHeaderTabHeight + homeHeaderContentContainerHeight;

interface QuizProps {
    onScroll: (e: any) => void;
}

const Quiz: React.FC<QuizProps> = ({ onScroll }) => {

    const theme: ExtendedTheme = useTheme();
    const { colors } = theme;

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {

    };

    const onLoadMore = () => {

    };

    const renderItem = () => {
        return <></>
    };

    const renderHeader = () => {
        return <></>
    };

    const renderFooter = () => {
        return <></>
    };

    const renderSeparatorComponent = () => {
        return <></>
    }

    const renderEmpty = () => {
        return <></>
    }

    return (
        <Animated.FlatList
            testID="quiz.list"
            style={styles.container}
            data={[]}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            ItemSeparatorComponent={renderSeparatorComponent}
            ListEmptyComponent={renderEmpty}
            // refreshControl={(
            //     <RefreshControl
            //         refreshing={refreshing}
            //         onRefresh={onRefresh}
            //         tintColor={colors.gray40}
            //         progressViewOffset={HeaderFilterHeight}
            //     />
            // )}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.2}
            onScroll={onScroll}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});

export default Quiz;
