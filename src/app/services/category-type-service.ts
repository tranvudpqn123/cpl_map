import {inject, Injectable} from '@angular/core';
import { map} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IResponseData} from '@models/response-data.interface';
import {UtilsService} from '@services/utils.service';
import {environment} from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MerchantFilterService {
    private readonly httpClient = inject(HttpClient);
    private readonly utilsService = inject(UtilsService);
    private  readonly  API_URL = environment.apiUrl;
    getListServiceType()   {
        const url = this.API_URL + `/portal/servicetype`;
        return this.httpClient.get<IResponseData<string>>(url)
            .pipe(map(res =>
                this.utilsService.convertKeysToCamelCase<IResponseData<any>>(res)));
    }

    getListSubServiceType(id: string)   {
        const url = this.API_URL + `/dropdown/subservicetype`;
        return this.httpClient.get<IResponseData<string>>(url)
            .pipe(map(res =>
                this.utilsService.convertKeysToCamelCase<IResponseData<any>>(res)));
    }
}

