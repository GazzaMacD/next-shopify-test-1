export const gql = String.raw;
export const SHOPIFY_FRONT_URL = `https://french-fromage.myshopify.com/api/2021-07/graphql.json`;
export const SITE_CONFIG = {
  title: `Shopify Test`,
  description: `Shopify Test`,
};

/*
 * Styles
 */
export const COLORS: { [key: string]: string } = {
  cream: `#f2dfbb`,
  cheese: `#f2b441`,
  platter: `#a66d03`,
  chocolate: `#593a01`,
  grape: `#a69b03`,
  olive: `#595302`,
  error: `#fa6927`,
  white: `#ffffff`,
};
/*
 * Cart
 */
export const DEFAULT_CURRENCY = `EUR`;
// Local Storage Keys Enum
export enum ELS_Keys {
  CART = `__cart__`,
  AUTH = `__azx__`,
}
/*
 * Forms
 */
/* error messages */
type TMsgLangs = Record<string, string>;
type TCommonErrMsgs = {
  required: TMsgLangs;
  trim: TMsgLangs;
};
type TEmailErrMsgs = {
  invalid: TMsgLangs;
  taken: TMsgLangs;
};
type TErrMsgs = {
  email: TEmailErrMsgs;
  common: TCommonErrMsgs;
};
export type TLocale = `en` | `ja` | `vn`;

// helpers and consts /
export const errMsgs: TErrMsgs = {
  common: {
    required: {
      en: `Required`,
      ja: ``,
      vn: ``,
    },
    trim: {
      en: `There should not be any whitespaces`,
      ja: ``,
      vn: ``,
    },
  },
  email: {
    invalid: {
      en: `Invalid email address`,
      ja: ``,
      vn: ``,
    },
    taken: {
      en: `This email is taken`,
      ja: ``,
      vn: ``,
    },
  },
};
