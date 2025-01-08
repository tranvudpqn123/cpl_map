import {ChangeDetectionStrategy, Component} from '@angular/core';
// Components
import {SidebarComponent} from '@pages/map/sidebar/sidebar.component';
import {SliderPhotosComponent} from '@pages/map/slider-photos/slider-photos.component';
import {FilterComponent} from '@pages/map/filter/filter.component';
import {PersonalGroupsComponent} from '@pages/map/personal-groups/personal-groups.component';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        SidebarComponent,
        SliderPhotosComponent,
        FilterComponent,
        PersonalGroupsComponent
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {

}
