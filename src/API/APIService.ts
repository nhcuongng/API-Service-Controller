import { ApiMethod } from "../types";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Post } from "./Post";
import { Todo } from "./Todo";

export class APIService {
  static method: ApiMethod = "GET";
  static headers: { [x: string]: string } = {};
  static errorHandler: any = null;
  static token: string = '';
  static urlBase: string = '';

  set token (t: string) {
    this.token = t;
  }

  set urlBase (url: string) {
    this.urlBase = url;
  }

  set headers (headers: { [x: string]: string }) {
    this.headers = headers;
  }

  set method (newMethod: ApiMethod) {
    this.method = newMethod;
  }

  static setMethod (_method: ApiMethod) {
    this.method = _method;
    return this;
  }

  static async _fetch<T>(url: string, body?: T) {
    const END_POINT = `${APIService.urlBase}${url}`;
    const axiosConfig: AxiosRequestConfig = {};
    if (APIService.token) {
      axiosConfig.headers = {
        Authorization: `Bearer ${APIService.token}`,
      };
    }
    switch (this.method) {
      case 'GET':
        return axios.get<T>(END_POINT, axiosConfig);
      case 'POST':
        return axios.post<T>(END_POINT, body, axiosConfig);
      case 'DELETE':
        return axios.delete<T>(END_POINT, axiosConfig);
      case 'PUT':
        return axios.put<T>(END_POINT, body, axiosConfig);
      default:
        throw new Error('Method is not support or is invalid'); 
    }
  }

  static async parseResult<T>(result: AxiosResponse | { status: string, data: T | undefined } | null) {
    if (!result || !result.status) {
      return {
        success: false,
        error: 'error:network_error',
      };
    }
    if (result.status > 499) {
      return {
        success: false,
        error: result.data.message || 'error:server_error',
      };
    }
    if (result.status === 401) {
      if (APIService.errorHandler) {
        APIService.errorHandler(result);
      }
      return {
        success: false,
        error: result.data.message || 'error:unauthorized',
      };
    }
    if (result.status > 399) {
      return {
        success: false,
        error: result.data.message || 'error:user_generic',
      };
    }
    if (result.status > 199 && result.data) {
      if (result.data.token) {
        APIService.token = result.data.token;
      }
      return {
        success: true,
        data: result.data as T,
      };
    }
    return {
      success: false,
      error: result.data.message || 'error:generic',
    };
  }

  static async request<T> (url: string, body?: T) {
    try {
      const result = await this._fetch(url, body);
      return APIService.parseResult<T>(result);
    } catch (error) {
      if (error.response && error.response.status) {
        return APIService.parseResult<T>({
          status: error.response.status,
          data: error.response.data as T,
        });
      }
      return APIService.parseResult<T>(null);
    }
  }

  static Post = Post
  static Todo = Todo
}