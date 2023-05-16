import React, { useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import useYourContentStore from '../../store';
import usePublishStore from './store';
import ContentItem from '~/components/ContentItem';
import { homeHeaderTabHeight, homeHeaderContentContainerHeight } from '~/theme/dimension';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import Image from '~/components/Image';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';

const HeaderFilterHeight = homeHeaderTabHeight + homeHeaderContentContainerHeight;

interface PublishProps {
    onScroll: (e: any) => void;
}

const Publish: React.FC<PublishProps> = ({ onScroll }) => {
    const theme: ExtendedTheme = useTheme();
    const { colors } = theme;
    const styles = createStyle();

    const { activePublishTab } = useYourContentStore((state) => state);
    const publishContents = usePublishStore((state) => state.publishContents);
    const actions = usePublishStore((state) => state.actions);

    const data = publishContents[activePublishTab];
    const { ids, loading, refreshing, hasNextPage } = data || {};

    useEffect(() => {
        getData(true);
    }, [activePublishTab]);

    const getData = (isRefresh: boolean) => {
        actions.getPublishContent({ isRefresh });
    };

    const onRefresh = () => {
        getData(true);
    };

    const onLoadMore = () => {
        if (hasNextPage) {
            getData(false);
        }
    };

    const renderItem = ({ item }) => (
        <ContentItem id={item} />
    );

    const keyExtractor = (item) => `publish-content-${item}`;
    
    const renderHeaderComponent = () => (
        <View style={styles.header}>
            <ViewSpacing height={spacing.margin.large} />
        </View>
    );

    const renderFooterComponent = () => {
        if (!loading) return <ViewSpacing height={spacing.padding.large} />;

        return (
            <View style={styles.boxFooter}>
                <ActivityIndicator />
            </View>
        );
    };

    const renderEmptyComponent = () => {
        if (hasNextPage) return null;

        return (
            <View style={styles.boxEmpty} testID="publish.empty_view">
                <Image
                    resizeMode="contain"
                    source={images.img_empty_box}
                    style={styles.imgEmpty}
                />
                <Text.BodyS color={colors.neutral40} useI18n>
                    your_content:text_no_publish_content
                </Text.BodyS>
            </View>
        );
    };

    const renderSeparatorComponent = () => <ViewSpacing height={spacing.margin.large} />;

    return (
        <Animated.FlatList
            testID="publish.content"
            data={ids}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={renderHeaderComponent}
            ListFooterComponent={renderFooterComponent}
            ListEmptyComponent={renderEmptyComponent}
            ItemSeparatorComponent={renderSeparatorComponent}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.2}
            onScroll={onScroll}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.colors.gray40}
                    progressViewOffset={HeaderFilterHeight}
                />
            )}
        />
    );
};

const createStyle = () => {
    return StyleSheet.create({
        header: {
            paddingTop: HeaderFilterHeight,
        },
        boxFooter: {
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
        },
        boxEmpty: {
            alignItems: 'center',
            paddingTop: 32,
            paddingBottom: 48,
        },
        imgEmpty: {
            width: 100,
            aspectRatio: 1,
            marginBottom: spacing.margin.base,
        },
    })
};

export default Publish;
