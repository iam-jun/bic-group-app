import _ from 'lodash';

export function getRandomInt(
  min: number, max: number,
): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateUniqueId(): string {
  return _.uniqueId();
}
