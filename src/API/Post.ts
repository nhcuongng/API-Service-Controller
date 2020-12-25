import { IPost } from "../@types/post.types";
import { APIService } from "./APIService";

export class Post extends APIService {
  static subUrl = '/posts';

  set subUrl (_url: string) {
    Post.subUrl = _url;
  }

  constructor() {
    super();
  }

  public async getPosts() {
    const res = await this
      .setMethod('GET')
      .request(Post.subUrl);
    return res;
  }

  public async getPost(id: number) {
    const res = await this
      .setMethod('GET')
      .request<IPost>(`${Post.subUrl}/${id}`);
    return res;
  }

  public async createPost(post: IPost) {
    const res = await this
      .setHeaders({
        test: 'this is a header'
      })
      .setMethod('POST')
      .request<IPost>(Post.subUrl, post)
    return res;
  }
}

export const PostApi = new Post();