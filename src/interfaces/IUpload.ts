import { IFilePicked } from "./common";

export enum ResourceUploadType {
    postContent = 'post:content',
    postVideo = 'post_video',
    postFile = 'post_file',

    articleContent = 'article:content',
    articleCover = 'article:cover',

    commentContent = 'comment:content',
    commentVideo = 'comment_video',


    seriesCover = 'series:cover',

    userAvatar = 'user:avatar',
    userCover = 'user:cover',

    groupAvatar = 'group:avatar',
    groupCover = 'group:cover',
};

export interface ICreateImageIdData {
    properties: {
        mime_type: string;
    };
    resource: ResourceUploadType;
};

export interface IPresignedPostFields {
    key: string;
    bucket: string;
    xAmzAlgorithm: string;
    xAmzCredential: string;
    xAmzDate: string;
    xAmzSecurityToken: string;
    policy: string;
    xAmzSignature: string;
};

export interface IUploadImageS3Params {
    presignedPostFields: IPresignedPostFields;
    urlUpload: string;
    file: IFilePicked;
};
