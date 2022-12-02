export interface ITopicDetail {
    id?: string;
    name?: string;
}

export interface IPayloadGetArticleTopicDetail {
    id?: string;
    isRefresh?: boolean;
    offset?: number;
    isProcessing?: boolean;
}
