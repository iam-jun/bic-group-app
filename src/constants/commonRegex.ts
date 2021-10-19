export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const emailRegex = /^[A-Za-z\d@.]{3,}$/;
// export const passwordRegex =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,20}$/;
export const passwordRegex = /^(?=.*\d)[A-Za-z\d@$!%*?&#^]{8,}$/;
export const codeRegex = /^[0-9]{1,6}$/;
export const mentionRegex = /@[^ ](?!(?:[^]*\s){3})[^@[\]]{1,24}/g;
export const audienceRegex = /@\[([^:@]+):([^:@]+):([^@\]]+)]/;
export const linkRegex =
  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
