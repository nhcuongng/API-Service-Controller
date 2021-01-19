/* eslint-disable no-underscore-dangle */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiHeader = { [x: string]: string };

export type ApiMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

export class APIService {
  /**
   * @memberof APIService
   *
   * Methods
   */
  private method: ApiMethod = 'GET';

  /**
   * @memberof APIService
   *
   * Headers's request
   */
  private headers: ApiHeader = {};

  /**
   * @memberof APIService
   *
   * Error handler for error requests
   */
  static errorHandler: any = null;

  /**
   * @memberof APIService
   *
   * Error loading for wait response
   */
  static loadingHandler: any = null;

  /**
   * @memberof APIService
   *
   * Authentication token
   */
  static token: string = '';

  /**
   * @memberof APIService
   *
   * url base - host's server
   */
  static urlBase: string = 'http://localhost:3000';

  set token(t: string) {
    this.token = t;
  }

  set urlBase(url: string) {
    this.urlBase = url;
  }

  set errorHandler(_errHandle: any) {
    this.errorHandler = _errHandle;
  }

  public setHeaders(headers: ApiHeader) {
    this.headers = headers;
    return this;
  }

  public setMethod(_method: ApiMethod) {
    this.method = _method;
    return this;
  }

  private _callErrorHandler(msg: string) {
    if (APIService.errorHandler) {
      APIService.errorHandler(msg);
    }
    return this;
  }

  private _callLoadingHandler() {
    if (APIService.loadingHandler) {
      APIService.loadingHandler();
    }
    return this;
  }

  /**
   *  determine method use by axios
   *
   * @param slug sub url to server
   * @param body mothods PUT, POST.. need body
   */
  private async _fetch<RequestBody>(slug: string, body?: RequestBody) {
    const END_POINT = `${APIService.urlBase}${slug}`;
    const axiosConfig: AxiosRequestConfig = {};
    const token = APIService.token;
    if (token) {
      axiosConfig.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    // nếu header tồn tại
    if (Object.keys(this.headers).length > 0 && this.headers.constructor === Object) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        ...this.headers,
      };
    }
    switch (this.method) {
      case 'GET':
        return axios.get<RequestBody>(END_POINT, axiosConfig);
      case 'POST':
        return axios.post<RequestBody>(END_POINT, body, axiosConfig);
      case 'DELETE':
        return axios.delete(END_POINT, axiosConfig);
      case 'PUT':
        return axios.put<RequestBody>(END_POINT, body, axiosConfig);
      default:
        throw new Error('Method is not support or is invalid');
    }
  }

  /**
   * Parse result from ```thís._fetch()```
   * 
   * You can use alter to show message error
   * 
   * Except error > 499 need show page error (or something else) because is fatal error
   * 
   * @param result
   */
  private async _parseResult<ResponseBody>(
    result: AxiosResponse<ResponseBody> | { status: number, data: any} | null,
  ) {
    if (!result || !result.status) {
      return {
        success: false,
        error: 'error:network_error',
      };
    }
    let msg = result.data.message;
    if (result.status > 499) {
      msg = msg || 'error:server_error';
      this._callErrorHandler(msg);
      return {
        success: false,
        error: msg,
      };
    }
    if (result.status === 401) {
      return {
        success: false,
        error: msg || 'error:unauthorized',
      };
    }
    if (result.status > 399) {
      return {
        success: false,
        error: msg || 'error:generic',
      };
    }
    if (result.status > 199) {
      if (result.data.token) {
        APIService.token = result.data.token;
      }
      return {
        success: true,
        data: result.data as ResponseBody,
      };
    }
    return {
      success: false,
      error: msg || 'error:generic',
    };
  }

  /**
   * Sending request to server
   * 
   * Support generic type for ```ResponseBody``` and ```RequestBody```
   * 
   * @description
   * - ```ResponseBody```: type safe for response receive from server
   * - ```RequestBody```: type safe for request body send to server
   * 
   * @param slug
   * @param body
   */
  public async request<
    ResponseBody = any,
    RequestBody = any,
  >(slug: string, body?: RequestBody, isLoading?: boolean) {
    try {
      isLoading && this._callLoadingHandler();
      const result = await this._fetch<RequestBody>(slug, body);
      this.setHeaders({}); // reset header sau khi gửi request
      isLoading && this._callLoadingHandler();
      return this._parseResult<ResponseBody>(result);
    } catch (error) {
      if (error.response && error.response.status) {
        return this._parseResult({
          status: error.response.status,
          data: error.response.data as ResponseBody,
        });
      }
      return this._parseResult<ResponseBody>(null);
    }
  }
}
