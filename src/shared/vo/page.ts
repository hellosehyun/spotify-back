export type Page = number & { readonly __brand: unique symbol };

export const createPage = (value: any): Page => {
  return value as Page;
};
