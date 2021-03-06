# Easy Control Api With API service

[![npm version](https://badge.fury.io/js/easy-control-api.svg)](https://badge.fury.io/js/easy-control-api)
![npm](https://img.shields.io/npm/dw/easy-control-api?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/easy-control-api?style=flat-square)
![David (path)](https://img.shields.io/david/nhcuongng/easy-control-api?style=flat-square)

*Control all your API requests at one place*

## Feartures

- Control API request in one place, maintain easily.
- Using axios default, if you want, you can use a axios instance
- Don't need try/catch on everytime call axios request, API Service handle it for you.
- Support global error, loading.
- Typescript support

## Use stage

```ts
import { IResponseBodyPost, IRequestBodyPost } from "./types";
import { APIService } from "easy-control-api";

export class Post extends APIService {
  static slug = '/posts';

  set slug (_url: string) {
    Post.slug = _url;
  }

  get slug() {
    return Post.slug;
  }

  public async getPosts() {
    const res = await this
      .setMethod('GET')
      .request(Post.slug);
    return res;
  }

  public async getPost(id: number) {
    const res = await this
      .setMethod('GET')
      .request<IResponseBodyPost>(`${Post.slug}/${id}`);
    return res;
  }

  public async createPost(post: IRequestBodyPost) {
    const res = await this
      .setHeaders({
        test: 'this is a header'
      })
      .setMethod('POST')
      .request<IResponseBodyPost, IRequestBodyPost>(Post.slug, post)
    return res;
  }
}

export const PostApi = new Post();
```

Method getPost/ createPost with return:

- **success is true and data reiceved** if request success
- **success is false and error** message if resquest failed, your can alter this error by [react-alter](https://www.npmjs.com/package/react-alert) or [react-toast](https://www.npmjs.com/package/react-toast)

## Demo

You can see example at [here](https://github.com/nhcuongng/easy-control-api/tree/main/src/example)
Or you can playground with [codesanbox](https://codesandbox.io/s/brave-einstein-ry1b6)
