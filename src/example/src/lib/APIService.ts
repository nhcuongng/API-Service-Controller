import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type ApiHeader = { [x: string]: string };

type ApiMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

export class APIService {

  /* -------------------------------------------------------------------------- */
  /*                             PRIVATE PROPERTIES                             */
  /* -------------------------------------------------------------------------- */

  /**
   * @memberof APIService
   *
   * Methods
   */
  static _method: ApiMethod = 'GET';

  /**
   * @memberof APIService
   *
   * Headers's request
   */
   static _headers: ApiHeader = {};


  /* -------------------------------------------------------------------------- */
  /*                             STATIC PROPERTIES                              */
  /* -------------------------------------------------------------------------- */

  /**
   *  @memberof APIService
   *  
   *  Custom axios
   */
  static _axios: AxiosInstance = axios

  /**
   * @memberof APIService
   *
   * Authentication token
   */
  static token: string = '';

  /* -------------------------------------------------------------------------- */
  /*                             SETTER STATIC PROPERTIES                       */
  /* -------------------------------------------------------------------------- */

  set token(t: string) {
    this.token = t;
  }

  set _axios(axios: AxiosInstance) {
    this._axios = axios;
  }

  /* -------------------------------------------------------------------------- */
  /*                               PUBLIC METHODS                               */
  /* -------------------------------------------------------------------------- */

   /**
   * @memberof APIService
   * 
   * This method will set headers in LOCAL API Service
   */
  public static setHeaders(headers: ApiHeader) {
    APIService._headers = {
      ...APIService._headers,
      ...headers,
    };
    return APIService;
  }

  /**
   * @memberof APIService
   * 
   * This method will reset headers in LOCAL API Service
   */
  public static resetHeaders() {
    APIService._headers = {};
    return APIService;
  }

  /**
   * @memberof APIService
   * 
   * Set method use to request to server
   * 
   * @param _method 
   */
  public static setMethod(_method: ApiMethod) {
    APIService._method = _method;
    return APIService;
  }

  /* -------------------------------------------------------------------------- */
  /*                   ERROR HANDLER (GLOBAL ONLY)                              */
  /* -------------------------------------------------------------------------- */

  // private _callLoadingHandler() {
  //   if (APIService.loadingHandler) {
  //     APIService.loadingHandler();
  //   }
  //   return this;
  // }

  // private _callErrorHandler(msg: string) {
  //   if (APIService.errorHandler) {
  //     APIService.errorHandler(msg);
  //   }
  //   return this;
  // }

  /* -------------------------------------------------------------------------- */
  /*                              CORES HANDLE LOGIC                            */
  /* -------------------------------------------------------------------------- */

  /**
   *  determine method use by axios
   *
   * @param slug sub url to server
   * @param body mothods PUT, POST.. need body
   */
  private static async _fetch<RequestBody>(slug: string, body?: RequestBody) {
    const axiosConfig: AxiosRequestConfig = {};
    const token = APIService.token;
    if (token) {
      axiosConfig.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    // nếu header tồn tại
    if (Object.keys(APIService._headers).length > 0 && APIService._headers.constructor === Object) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        ...APIService._headers,
      };
    }
    switch (APIService._method) {
      case 'GET':
        return APIService._axios.get<RequestBody>(slug, axiosConfig);
      case 'POST':
        return APIService._axios.post<RequestBody>(slug, body, axiosConfig);
      case 'DELETE':
        return APIService._axios.delete<RequestBody>(slug, axiosConfig);
      case 'PUT':
        return APIService._axios.put<RequestBody>(slug, body, axiosConfig);
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
  private static async _parseResult<ResponseBody>(
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
      // this._callErrorHandler(msg);
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
   * @example
   * ```ts
   * public async getPost(id: number) {
      const res = await this
        .setMethod('GET')
        .request<IResponseBodyPost>(`${Post.slug}/${id}`);
      return res;
    }
   * 
   * ```
   * 
   * @param slug your url
   * @param body payload send to server
   * @param isLoading if your request is global request, and need show loading bar
   */
  public static async request<
    ResponseBody = any,
    RequestBody = any,
  >(
    slug: string,
    body?: RequestBody,
    // isLoading?: boolean
  ) {
    try {
      // isLoading && this._callLoadingHandler();
      const result = await APIService._fetch<RequestBody>(slug, body);
      // isLoading && this._callLoadingHandler();
      return APIService._parseResult<ResponseBody>(result);
    } catch (error) {
      if (error.response && error.response.status) {
        return APIService._parseResult({
          status: error.response.status,
          data: error.response.data as ResponseBody,
        });
      }
      return APIService._parseResult<ResponseBody>(null);
    }
  }
}
