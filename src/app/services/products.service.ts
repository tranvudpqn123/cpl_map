import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IResponseData} from '@models/response-data.interface';
import {UtilsService} from '@services/utils.service';
import {environment} from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private readonly httpClient = inject(HttpClient);
    private readonly utilsService = inject(UtilsService);
    private  readonly  API_URL = environment.apiUrl;

    getProduct(id: string | undefined): Observable<IResponseData<any>> {
        const data = {
            partner_id: id,
            page_no: 1,
            page_size: 1000,
        }
        const url = `http://103.72.98.97/api/app/customer/home/listProduct`;
        return this.httpClient.post<IResponseData<any>>(url,data,{
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAzNzk2ODU5MzMiLCJuYW1laWQiOiJjdXN0b21lciIsImZhbWlseV9uYW1lIjoiMTg2MGUzYmQtMGVmMS00NWUwLWE5NzYtZDA2YzAyMmUzZjgyIiwibmJmIjoxNzM2OTEwMzAzLCJleHAiOjE3MzgxMTk5MDMsImlhdCI6MTczNjkxMDMwM30.G8Em2Rt7bsd5qg7wy_F7nl0WLB1cJ5O1KzVoqcMgZO0`
            }
        })
            .pipe(map(res =>
                this.utilsService.convertKeysToCamelCase<IResponseData<any>>(res)));
    }

    getListProductType(id:string | undefined): Observable<IResponseData<any>> {
        const url = `http://103.72.98.97/api/app/customer/home/productGroup/${id}`;
        return this.httpClient.get<IResponseData<any>>(url,{
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAzNzk2ODU5MzMiLCJuYW1laWQiOiJjdXN0b21lciIsImZhbWlseV9uYW1lIjoiMTg2MGUzYmQtMGVmMS00NWUwLWE5NzYtZDA2YzAyMmUzZjgyIiwibmJmIjoxNzM2OTEwMzAzLCJleHAiOjE3MzgxMTk5MDMsImlhdCI6MTczNjkxMDMwM30.G8Em2Rt7bsd5qg7wy_F7nl0WLB1cJ5O1KzVoqcMgZO0`
            }
        })
            .pipe(map(res =>
                this.utilsService.convertKeysToCamelCase<IResponseData<any>>(res)));
    }
}

