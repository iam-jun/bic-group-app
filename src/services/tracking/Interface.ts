import { PostType } from '~/interfaces/IPost';
import { TrackingEventContentReadAction } from './constants';

export type TrackingEventContentReadProperties = {
    content_type: PostType,
    action: TrackingEventContentReadAction
}

export type TrackingEventContentPublishedProperties = {
    content_type: PostType,
    important: boolean,
}

export type TrackingEventEmojiReactedProperties = {
    reaction_name: string;
}

export type TrackingEventCommentAddedProperties = {
    images: boolean;
    gif: boolean;
}

export type TrackingEventImportantMarkedProperties = {
    content_type: PostType,
}
