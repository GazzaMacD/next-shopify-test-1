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
  cream: ` #f2dfbb`,
  cheese: ` #f2b441`,
  platter: ` #a66d03`,
  chocolate: ` #593a01`,
  grape: ` #a69b03`,
  olive: ` #595302`,
  error: ` #fa6927`,
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
