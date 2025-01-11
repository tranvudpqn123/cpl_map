import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    deepClone<T>(data: any) {
        return JSON.parse(JSON.stringify(data)) as T;
    }

    isElementFullyInViewport(element: HTMLElement): boolean {
        const rect = element.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    toQueryString(obj: object): string {
        return Object.entries(obj)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    private toCamelCase(str: string): string {
        const camelCased = str.replace(/([-_][a-z])/gi, (match) =>
            match.charAt(1).toUpperCase()
        );
        return camelCased.charAt(0).toLowerCase() + camelCased.slice(1);
    }

    convertKeysToCamelCase<T>(obj: any): T {
        if (Array.isArray(obj)) {
            return obj.map(item => this.convertKeysToCamelCase(item)) as T;
        } else if (obj !== null && obj.constructor === Object) {
            return Object.keys(obj).reduce((acc, key) => {
                const camelCaseKey = this.toCamelCase(key);
                acc[camelCaseKey] = this.convertKeysToCamelCase(obj[key]);
                return acc;
            }, {} as any) as T;
        }

        return obj;
    }

    removeAccents(str: string): string {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

}
