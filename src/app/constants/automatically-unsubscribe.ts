import {Component, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-automatically-unsubscrive',
    template: '',
    standalone: true
})
export class AutomaticallyUnsubscribe implements OnDestroy {
    protected destroyFlag = new Subject();

    ngOnDestroy(): void {
        this.destroyFlag.next(null);
        this.destroyFlag.unsubscribe();
    }

}
