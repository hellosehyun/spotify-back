export type Object = { key: string; buffer: Buffer } & { readonly __brand: unique symbol };

export const createObject = (value: any): Object => {
  return value as Object;
};
