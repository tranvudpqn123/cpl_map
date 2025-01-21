import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IResponseData} from '@models/response-data.interface';
import {UtilsService} from '@services/utils.service';
import {environment} from '@environments/environment';
import {IServiceType} from '@services/merchant-filter.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly httpClient = inject(HttpClient);
    private readonly utilsService = inject(UtilsService);
    readonly listServiceType = new BehaviorSubject<IServiceType[]>([]);
    private readonly listSubServiceType = new BehaviorSubject<IServiceType[]>([]);

    private  readonly  API_URL = environment.apiUrl;
    // getListServiceType()   {
    //     const url = `http://103.72.98.97/api/app/dropdownapp/servicetype`;
    //     return this.httpClient.get<IResponseData<string>>(url,{
    //         headers: {
    //             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAzNzk2ODU5MzMiLCJuYW1laWQiOiJjdXN0b21lciIsImZhbWlseV9uYW1lIjoiMTg2MGUzYmQtMGVmMS00NWUwLWE5NzYtZDA2YzAyMmUzZjgyIiwibmJmIjoxNzM2OTEwMzAzLCJleHAiOjE3MzgxMTk5MDMsImlhdCI6MTczNjkxMDMwM30.G8Em2Rt7bsd5qg7wy_F7nl0WLB1cJ5O1KzVoqcMgZO0`
    //         }
    //     })
    //         .pipe(map(res =>
    //             this.utilsService.convertKeysToCamelCase<IResponseData<any>>(res)));
    // }
    //
    // getListSubServiceType(id: string)   {
    //     const url = `http://103.72.98.97/api/app/dropdownapp/subservicetype` + `?service_type_id=${id}`;
    //     return this.httpClient.get<IResponseData<string>>(url,{
    //         headers: {
    //             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAzNzk2ODU5MzMiLCJuYW1laWQiOiJjdXN0b21lciIsImZhbWlseV9uYW1lIjoiMTg2MGUzYmQtMGVmMS00NWUwLWE5NzYtZDA2YzAyMmUzZjgyIiwibmJmIjoxNzM2OTEwMzAzLCJleHAiOjE3MzgxMTk5MDMsImlhdCI6MTczNjkxMDMwM30.G8Em2Rt7bsd5qg7wy_F7nl0WLB1cJ5O1KzVoqcMgZO0`
    //         }
    //     })
    //         .pipe(map(res =>
    //             this.utilsService.convertKeysToCamelCase<IResponseData<any>>(res)));
    // }

    addListServiceType(data: IServiceType[]){
        this.listServiceType.next(data);
    }
    addListSubServiceType(data: IServiceType[]){
        this.listSubServiceType.next(data);
    }

}

