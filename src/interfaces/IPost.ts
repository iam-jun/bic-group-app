export default interface Props {
  content: string;
  reaction: {like: number; comment: number; share: number};
  isLike?: boolean;
}
