export const EMAIL_REGEX = /^([0-9a-zA-Z]{3,}|[0-9a-zA-Z]+([._-][0-9a-zA-Z]+)+)@([0-9a-zA-Z]+[._-])+[0-9a-zA-Z]{2,4}$/
export const CHARACTERS_REGEX = /^[\p{L}0-9]+(?:\s*[\p{L}0-9]+)*$/u
export const CHARACTERS_ONLY_REGEX = /^[\p{L}]+(?:\s[\p{L}]+)*$/u
export const PHONE_NUMBER_START_REGEX = /^0\d*$/
export const PHONE_NUMBER_REGEX = /^\d*$/
export const MULTIPLE_SPACE_REGEX = /\s{2,}/
export const PHONE_NUMBER_VALID_REGEX = /^0(?!0+$)[0-9]{9,10}$/
