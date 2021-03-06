import { APIService } from "../lib/APIService";


export class Todo extends APIService {
  static slug = '/todos';

  set slug (_url: string) {
    Todo.slug = _url;
  }

  get slug() {
    return Todo.slug;
  }

  public async getTodos () {
    const res = await Todo
      .setMethod('GET')
      .request(Todo.slug);
    return res;
  }
}

export const ToDoApi = new Todo()