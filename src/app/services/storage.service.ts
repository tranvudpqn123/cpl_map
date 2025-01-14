import {inject, Injectable} from '@angular/core';
import {UtilsService} from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private utilsService = inject(UtilsService);

    setItem(val: unknown, key: string) {
        if (val === null || val === undefined) return;

        if (typeof val === 'object') {
            localStorage.setItem(key, JSON.stringify(val));
        } else {
            localStorage.setItem(key, val.toString());
        }
    }

    getItem<T>(key: string): T | null {
        const val = localStorage.getItem(key);
        try {
            return  JSON.parse(val || '') as T;
        } catch {
            return val as T;
        }
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }
}
