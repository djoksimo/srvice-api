import fetch from "node-fetch";
import { AuthHeaders } from "../../types";

class HttpUtils {
  static async get(domain: string, route: string, queryParams?: Record<string, any>) {
    const queryString = !queryParams
      ? route
      : `${route}?${Object.keys(queryParams)
          .map((key) => `${key}=${queryParams[key]}`)
          .join("&")}`;
    const response = await fetch(`${domain}/${queryString}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    return response.json();
  }

  static async post(endpoint: string, payload: Record<string, any>, authHeaders?: AuthHeaders) {
    let headers: Record<string, any> = {
      Accept: "application/json",
      "Content-Type": contentType,
      token: authHeaders,
    };

    if (authHeaders) {
      headers = { ...headers, ...authHeaders };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  static async patch(endpoint: string, payload: Record<string, any>, authHeader: AuthHeaders) {
    let headers: Record<string, any> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    headers = Object.assign(headers, authHeader);
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  static async delete(endpoint: string, payload: Record<string, any>, authHeader: AuthHeaders) {
    let headers: Record<string, any> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    headers = Object.assign(headers, authHeader);
    const body = payload ? JSON.stringify(payload) : undefined;
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers,
      body,
    });
    return response.json();
  }
}
export default HttpUtils;
