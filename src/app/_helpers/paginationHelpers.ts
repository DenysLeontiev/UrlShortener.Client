import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";

export function getPaginatedResult<T>(url: string, params: HttpParams, httpClient: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;

    return httpClient.get<T>(url, { observe: 'response', params }).pipe(
        map((response) => {
            if (response.body) {
                paginatedResult.result = response.body;
            }
            const pagination = response.headers.get('Pagination');
            if (pagination) {
                paginatedResult.pagination = JSON.parse(pagination);
            }
            return paginatedResult;
        })
    );
}

export function getPaginationHeaders<T>(paramsObject: T): HttpParams {
    let params = new HttpParams();

    for (const key in paramsObject) {
        if (paramsObject!.hasOwnProperty(key) && paramsObject[key] !== undefined && paramsObject[key] !== null) {
            params = params.append(key, paramsObject[key].toString());
        }
    }

    return params;
}