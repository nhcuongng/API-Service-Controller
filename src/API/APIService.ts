import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiHeader, ApiMethod, KeyValue } from '../@types/api.types';

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
   * Tuthentication token
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

  /**
   * Dùng để xác định dùng method nào để gửi lên server, dựa vào```APIService.method```
   * 
   * @param url sub url gửi lên server
   * @param body nếu ```APIService.method``` là PUT, POST.. thì cần body
   */
  private async _fetch<T>(url: string, body?: T) {
    const END_POINT = `${APIService.urlBase}${url}`;
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
  private async _parseResult<T>(result: AxiosResponse | { status: string, data: T | undefined } | null) {
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
   * @param url 
   * @param body 
   */
  public async request<T> (url: string, body?: T) {
    try {
      const result = await this._fetch(url, body);
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
