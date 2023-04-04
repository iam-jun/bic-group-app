import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IPost } from '~/interfaces/IPost';
import CollapsibleText from '~/baseComponents/Text/CollapsibleText';
import Markdown from '~/beinComponents/Markdown';
import MarkdownView from '~/beinComponents/MarkdownView';
import PinPostImage from './PinPostImage';
import PinPostFile from './PinPostFile';
import PinPostVideo from './PinPostVideo';

interface PinPostBodyProps {
    data: IPost;
}

const PinPostBody: React.FC<PinPostBodyProps> = ({ data }) => {
    const { media, content } = data || {};
    const { images, videos, files } = media || {};

    if (!content && images?.length !== 0) {
        return <PinPostImage />
    }

    if (!content && videos?.length !== 0) {
        return <PinPostVideo />
    }

    if (!content && files?.length !== 0) {
        return <PinPostFile />
    }

    return (
        <View style={styles.container}>
            {/* <Markdown value={content} /> */}
            <MarkdownView>
                { content }
            </MarkdownView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default PinPostBody;
