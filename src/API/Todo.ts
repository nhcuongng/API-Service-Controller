import { APIService } from "./APIService";

export class Todo {
  static urlBase = '/todos';

  static async getTodos () {
    const res = await APIService.request(this.urlBase);
    return res;
  }
}