export interface IRequestBodyPost{
  title: string,
  body: string,
  userId: number,
}

export interface IResponseBodyPost{
  title: string,
  body: string,
  userId: number,
  id: number,
}