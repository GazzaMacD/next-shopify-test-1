import { SHOPIFY_FRONT_URL } from "../constants";

/* fetchShopifyGQL */
type TFSGQLProps = {
  endPoint?: string;
  query: string;
  operationName?: string;
  variables?: Record<string, unknown>;
  customConfig?: Record<string, unknown>;
  controller?: AbortController;
};

export async function fetchShopifyGQL<ResponseData>({
  endPoint = SHOPIFY_FRONT_URL,
  query,
  operationName,
  variables,
  customConfig = {},
  controller,
}: TFSGQLProps): Promise<ResponseData> {
  const fnName = `fetchShopifyGQL`;
  const token =
    process.env.NEXT_PUBLIC_STORE_FRONT_ACCESS_TOKEN ?? `invalid token`;
  const config = {
    method: `POST`,
    headers: {
      "Content-Type": `application/json`,
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: query,
      operationName: operationName ? operationName : ``,
      variables: variables ? variables : {},
    }),
    signal: controller ? controller.signal : null,
    ...customConfig,
  };

  if (!endPoint || !query) {
    return Promise.reject({
      errors: [
        {
          status: 477,
          message: `EndPoint or query are required for ${fnName}`,
        },
      ],
    });
  }
  const response = await fetch(endPoint, config);

  if (!response.ok) {
    return Promise.reject({
      errors: [
        {
          status: response.status,
          message: response.statusText,
        },
      ],
    });
  }
  const responseData = await response.json();
  return responseData;
} // end shopify
