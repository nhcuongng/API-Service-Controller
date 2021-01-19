import { IResponseBodyPost, IRequestBodyPost } from "../@types/post.types";
import { APIService } from "./APIService";

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