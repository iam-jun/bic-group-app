import { PostStatus } from '~/interfaces/IPost';

export const isScheduledContent = (status: PostStatus) => [
  PostStatus.WAITING_SCHEDULE,
  PostStatus.SCHEDULE_FAILED,
].includes(status);
