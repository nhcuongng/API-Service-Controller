import { IResponseBodyPost, IRequestBodyPost } from "./types";
import { APIService } from "../lib/APIService";

export class Post extends APIService {
  static slug = '/posts';

  set slug (_url: string) {
    Post.slug = _url;
  }

  get slug() {
    return Post.slug;
  }

  public async getPosts() {
    const res = await Post
      .setMethod('GET')
      .request(Post.slug);
    return res;
  }

  public async getPost(id: number) {
    const res = await Post
      .setMethod('GET')
      .request<IResponseBodyPost>(`${Post.slug}/${id}`);
    return res;
  }

  public async createPost(post: IRequestBodyPost) {
    const res = await Post
      .setHeaders({
        test: 'this is a header'
      })
      .setMethod('POST')
      .request<IResponseBodyPost, IRequestBodyPost>(Post.slug, post)
    Post.resetHeaders()
    return res;
  }
}

export const PostApi = new Post();