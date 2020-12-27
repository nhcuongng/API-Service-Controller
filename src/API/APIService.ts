import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiHeader, ApiMethod } from '../@types/api.types';

export class APIService {
  /**
   * @memberof APIService
   * 
   * Method mà API sẽ gửi lên server
   */
  private method: ApiMethod = "GET";

  /**
   * @memberof APIService
   * 
   * Headers gửi lên server
   */
  private headers: ApiHeader = {};

  /**
   * @memberof APIService
   * 
   * Error handler sẽ chịu trách nhiệm xử lý các request bị lỗi
   */
  private errorHandler: any = null;

  /**
   * @memberof APIService
   * 
   * Authentication token
   */
  static token: string = '';

  /**
   * @memberof APIService
   * 
   * url base là url host của server
   */
  static urlBase: string = '';

  set token (t: string) {
    this.token = t;
  }

  set urlBase (url: string) {
    this.urlBase = url;
  }

  public setHeaders (headers: ApiHeader) {
    this.headers = headers;
    return this;
  }

  public setMethod (_method: ApiMethod) {
    this.method = _method;
    return this;
  }

  public setErrorHandler(_errorHandler: any) {
    this.errorHandler = _errorHandler;
    return this;
  }

  /**
   * Dùng để xác định dùng method nào để gửi lên server, dựa vào```this.method```
   * 
   * @param slug sub url gửi lên server
   * @param body nếu ```this.method``` là PUT, POST.. thì cần body
   */
  private async _fetch<T>(slug: string, body?: T) {
    const END_POINT = `${APIService.urlBase}${slug}`;
    const axiosConfig: AxiosRequestConfig = {  };
    if (APIService.token) {
      axiosConfig.headers = {
        Authorization: `Bearer ${APIService.token}`,
      };
    }
    // nếu header tồn tại
    if (Object.keys(this.headers).length > 0 && this.headers.constructor === Object) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        ...this.headers,
      }
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

  /**
   * Phân tích kết quả trả về từ ```thís._fetch()```
   * @param result 
   */
  private async _parseResult<T>(result: AxiosResponse | { status: number, data: T | undefined } | null) {
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
      if (this.errorHandler) {
        this.errorHandler(result);
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

  /**
   * Dùng để gửi request lên server
   * @param slug 
   * @param body 
   */
  public async request<T> (slug: string, body?: T) {
    try {
      const result = await this._fetch(slug, body);
      this.setHeaders({}); // reset header sau khi gửi request
      return this._parseResult<T>(result);
    } catch (error) {
      if (error.response && error.response.status) {
        return this._parseResult<T>({
          status: error.response.status,
          data: error.response.data as T,
        });
      }
      return this._parseResult<T>(null);
    }
  }
}
