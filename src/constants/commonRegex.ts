// eslint-disable-next-line max-len
export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const emailRegex = /^[A-Za-z\d@.]{3,}$/;
// export const passwordRegex =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,20}$/;
export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
export const codeRegex = /^[0-9]{1,6}$/;
export const limitCharacterRegex = /^.{8,20}$/;
export const uppercaseLetterRegex = /(?=.*?[A-Z])/;
export const lowercaseLetterRegex = /(?=.*?[a-z])/;
export const digitsRegex = /(?=.*?[0-9])/;
export const specialCharacterRegex = /(?=.*?[^\w])/;
// eslint-disable-next-line max-len
export const fullNameRegex = /^[A-Za-z\u00C0-\u1EF9 ]+$/; // Contain only A-Z, a-z letters, white space and Vietnamese characters
export const userNameRegex = /^[a-z][a-z0-9.]*$/; // Start with a-z, remaining characters only a-z, 0-9 and "."

/**
 * mentionRegex
 * - Not a space right after '@'
 * - No more than 3 spaces after '@'
 * - No @, [, ] after '@'
 */
// eslint-disable-next-line no-irregular-whitespace
export const mentionRegex = /@(?![\s​])(?!(?:[^]*\s){3})[^@[\]]{1,24}/g;
export const audienceRegex = /@\[([^:@]+):([^:@]+):([^@\]]+)]/;
export const linkRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/i;
export const phoneNumberRegex = /^[0-9]+$/;
// eslint-disable-next-line no-useless-escape
export const uuidRegex = /^[a-f0-9\-]{36}$/i;
