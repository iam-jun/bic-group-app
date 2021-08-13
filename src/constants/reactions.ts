import {IReactionProps} from '~/interfaces/IReaction';
import reactionIcons from '~/resources/reactions';

export const reactions = {
  angry_furious: {
    id: 'angry_furious',
    icon: 'angry_furious',
  },
  congratulations_party: {
    id: 'congratulations_party',
    icon: 'congratulations_party',
  },
  crazy_love_heart: {
    id: 'crazy_love_heart',
    icon: 'crazy_love_heart',
  },
  crying_sad: {
    id: 'crying_sad',
    icon: 'crying_sad',
  },
  curious: {
    id: 'curious',
    icon: 'curious',
  },
  excited: {
    id: 'excited',
    icon: 'excited',
  },
  explosive_meltdown: {
    id: 'explosive_meltdown',
    icon: 'explosive_meltdown',
  },
  fake_happy: {
    id: 'fake_happy',
    icon: 'fake_happy',
  },
  greedy_money: {
    id: 'greedy_money',
    icon: 'greedy_money',
  },
  laugh_lol: {
    id: 'laugh_lol',
    icon: 'laugh_lol',
  },
  laugh_rofl: {
    id: 'laugh_rofl',
    icon: 'laugh_rofl',
  },
  like_a_boss_cool: {
    id: 'like_a_boss_cool',
    icon: 'like_a_boss_cool',
  },
  love_hearts: {
    id: 'love_hearts',
    icon: 'love_hearts',
  },
  pleading_cute: {
    id: 'pleading_cute',
    icon: 'pleading_cute',
  },
  pokerface: {
    id: 'pokerface',
    icon: 'pokerface',
  },
  relieved_laughter: {
    id: 'relieved_laughter',
    icon: 'relieved_laughter',
  },
  sad_sweat: {
    id: 'sad_sweat',
    icon: 'sad_sweat',
  },
  scare_frightened: {
    id: 'scare_frightened',
    icon: 'scare_frightened',
  },
  smile_laugh: {
    id: 'smile_laugh',
    icon: 'smile_laugh',
  },
  stunned_game_over: {
    id: 'stunned_game_over',
    icon: 'stunned_game_over',
  },
  stunned_wow: {
    id: 'stunned_wow',
    icon: 'stunned_wow',
  },
  tongue_out_smile: {
    id: 'tongue_out_smile',
    icon: 'tongue_out_smile',
  },
  wink_kiss: {
    id: 'wink_kiss',
    icon: 'wink_kiss',
  },
  worry_sad: {
    id: 'worry_sad',
    icon: 'worry_sad',
  },
};

export type ReactionType = keyof typeof reactions;
export default reactions;
