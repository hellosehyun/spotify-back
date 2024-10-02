export type Track = { eid: string; [key: string]: any } & { __brand: symbol }

export const Track = (val: any): Track => {
  return val as Track
}
