import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IData, IResponseData} from '@models/response-data.interface';
import {UtilsService} from '@services/utils.service';
import {environment} from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private readonly httpClient = inject(HttpClient);
    private readonly utilsService = inject(UtilsService);
    private  readonly  API_URL = environment.apiUrl;

    getRating(id: string | undefined): Observable<IResponseData<IData>> {
        const data = {partner_id: id}
        const url = `http://103.72.98.97/api/app/customer/home/listRating`;
        return this.httpClient.post<IResponseData<IData>>(url,data,{
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAzODQ4MjEwODIiLCJuYW1laWQiOiJjdXN0b21lciIsImZhbWlseV9uYW1lIjoiZmExOTk3ZDAtNTIwMi00NzUwLTkwYWEtN2RhMDQyNDMxMDQzIiwibmJmIjoxNzM3MTc0NTUwLCJleHAiOjE3MzgzODQxNTAsImlhdCI6MTczNzE3NDU1MH0.4OJuDT7yndAp4xReX4prM0Zp63zFQ9KAxrg0szanAD8`
            }
        })
            .pipe(map(res =>
                this.utilsService.convertKeysToCamelCase<IResponseData<IData>>(res)));
    }

}

