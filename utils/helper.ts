import { checkIsValidEmail } from "./third-party-helper";

export function stringToSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, '');
  str = str.toLowerCase();

  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return str;
}

export function checkIsValidUserInfo(userInfo: any) {
  if (userInfo === undefined || userInfo === null || !userInfo.name || !checkIsValidEmail(userInfo.email) || !Array.isArray(userInfo.roles)) {
    return false;
  }
  return true;
}

export function parseCookieValue(cookieValue: any) {
  try {
    return JSON.parse(cookieValue);
  } catch (error) {
    return null;
  }
}