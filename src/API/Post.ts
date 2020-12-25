import { IPost } from "../@types/post.types";
import { APIService } from "./APIService";

export class Post extends APIService {
  static urlBase = '/posts';

  static async getPosts() {
    const res = await super
      .setMethod('GET')
      .request(Post.urlBase);
    return res;
  }

  static async getPost(id: number) {
    const res = await super
      .setMethod('GET')
      .request<IPost>(`${this.urlBase}/${id}`);
    return res;
  }

  static async createPost(post: IPost) {
    const res = await super
      .setMethod('POST')
      .request<IPost>(this.urlBase, post)
    return res;
  }
}