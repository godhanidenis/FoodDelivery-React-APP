import * as Yup from 'yup';

const phoneNumberRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

export const yupPhoneNumberValidator = Yup.string().matches(phoneNumberRegExp, "Phone number is not valid")

