import { IPost } from "../@types/post.types";
import { APIService } from "./APIService";

export class Post {
  static urlBase = '/posts';

  static async getPosts() {
    const res = await APIService
      .setMethod('GET')
      .request<IPost[]>(this.urlBase);
    return res;
  }

  static async getPost(id: number) {
    const res = await APIService.request<IPost>(`${this.urlBase}/${id}`);
    return res;
  }

  static async createPost(post: IPost) {
    const res = await APIService
      .setMethod('POST')
      .request<IPost>(this.urlBase, post)
    return res;
  }
}