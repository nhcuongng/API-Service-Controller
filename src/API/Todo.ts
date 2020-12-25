import { APIService } from "./APIService";

export class Todo extends APIService {
  static urlBase = '/todos';

  static async getTodos () {
    const res = await super
      .setMethod('GET')
      .request(Todo.urlBase);
    return res;
  }
}