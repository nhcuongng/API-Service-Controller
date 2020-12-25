import { APIService } from "./APIService";

export class Todo extends APIService {
  static subUrl = '/todos';

  constructor() {
    super();
  }

  set subUrl (_url: string) {
    Todo.subUrl = _url;
  }

  get subUrl() {
    return Todo.subUrl;
  }

  public async getTodos () {
    const res = await this
      .setMethod('GET')
      .request(Todo.subUrl);
    return res;
  }
}

export const ToDoApi = new Todo()