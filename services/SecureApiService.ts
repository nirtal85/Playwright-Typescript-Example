import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { readFileSync } from 'fs';
import { Agent } from 'https';
import path from 'path';

/**
 * A generic payload interface for secure POST requests.
 * Replace or extend this with domain-specific fields if needed.
 */
export interface SecurePostPayload {
  [key: string]: any;
}

/**
 * A simple, secure API service using mutual TLS (mTLS) authentication with Axios.
 */
export class SecureApiService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    const cert = readFileSync(path.resolve('resources/certificate/cert.pem'));
    const key = readFileSync(path.resolve('resources/certificate/private-key.pem'));
    const httpsAgent = new Agent({
      cert,
      key,
      rejectUnauthorized: true
    });
    const config: AxiosRequestConfig = {
      httpsAgent,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEARER}`
      }
    };
    this.axiosInstance = axios.create(config);
    this.axiosInstance.interceptors.response.use(
      (res: AxiosResponse) => res,
      (err: any) => {
        return Promise.reject(err);
      }
    );
  }

  /**
   * Sends a secure POST request with client certificate authentication.
   @param url Full URL to the endpoint (e.g., 'https://api.example.com/v1/resource')
   @param payload Request body data
   @param config Optional Axios request configuration
   */
  async post<T = any>(
    url: string,
    payload: SecurePostPayload,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, payload, config);
  }
}
