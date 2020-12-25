export type ApiHeader = { [x: string]: string };

export type ApiMethod = "POST" | "GET" | "PUT" | "DELETE";

export type KeyValue<T, U> = {
  key: T,
  value: U,
};