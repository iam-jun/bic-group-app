import {IReactionProps} from '~/interfaces/IReaction';
import reactionIcons from '~/resources/reactions';

export const reactions = {
  angry_furious: {
    id: 'angry_furious',
    icon: reactionIcons.angry_furious,
  },
  congratulations_party: {
    id: 'congratulations_party',
    icon: reactionIcons.congratulations_party,
  },
  crazy_love_heart: {
    id: 'crazy_love_heart',
    icon: reactionIcons.crazy_love_heart,
  },
  crying_sad: {
    id: 'crying_sad',
    icon: reactionIcons.crying_sad,
  },
  curious: {
    id: 'curious',
    icon: reactionIcons.curious,
  },
  excited: {
    id: 'excited',
    icon: reactionIcons.excited,
  },
  explosive_meltdown: {
    id: 'explosive_meltdown',
    icon: reactionIcons.explosive_meltdown,
  },
  fake_happy: {
    id: 'fake_happy',
    icon: reactionIcons.fake_happy,
  },
  greedy_money: {
    id: 'greedy_money',
    icon: reactionIcons.greedy_money,
  },
  laugh_lol: {
    id: 'laugh_lol',
    icon: reactionIcons.laugh_lol,
  },
  laugh_rofl: {
    id: 'laugh_rofl',
    icon: reactionIcons.laugh_rofl,
  },
  like_a_boss_cool: {
    id: 'like_a_boss_cool',
    icon: reactionIcons.like_a_boss_cool,
  },
  love_hearts: {
    id: 'love_hearts',
    icon: reactionIcons.love_hearts,
  },
  pleading_cute: {
    id: 'pleading_cute',
    icon: reactionIcons.pleading_cute,
  },
  pokerface: {
    id: 'pokerface',
    icon: reactionIcons.pokerface,
  },
  relieved_laughter: {
    id: 'relieved_laughter',
    icon: reactionIcons.relieved_laughter,
  },
  sad_sweat: {
    id: 'sad_sweat',
    icon: reactionIcons.sad_sweat,
  },
  scare_frightened: {
    id: 'scare_frightened',
    icon: reactionIcons.scare_frightened,
  },
  smile_laugh: {
    id: 'smile_laugh',
    icon: reactionIcons.smile_laugh,
  },
  stunned_game_over: {
    id: 'stunned_game_over',
    icon: reactionIcons.stunned_game_over,
  },
  stunned_wow: {
    id: 'stunned_wow',
    icon: reactionIcons.stunned_wow,
  },
  tongue_out_smile: {
    id: 'tongue_out_smile',
    icon: reactionIcons.tongue_out_smile,
  },
  wink_kiss: {
    id: 'wink_kiss',
    icon: reactionIcons.wink_kiss,
  },
  worry_sad: {
    id: 'worry_sad',
    icon: reactionIcons.worry_sad,
  },
};

export type ReactionType = keyof typeof reactions;
export default reactions;
