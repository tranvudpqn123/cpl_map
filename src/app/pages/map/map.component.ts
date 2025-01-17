import {ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild} from '@angular/core';
// Services
import {
    EAddressGroupType, EShowMerchantGroupType,
    IListAddress,
    IServiceType,
    ISubServiceType,
    MerchantFilterService
} from '@services/merchant-filter.service';
// Components
import {SidebarComponent} from '@pages/map/sidebar/sidebar.component';
import {FilterComponent} from '@pages/map/filter/filter.component';
import {PersonalGroupsComponent} from '@pages/map/personal-groups/personal-groups.component';
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';

import {firstValueFrom, takeUntil} from 'rxjs';
import {CommonModule} from '@angular/common';
import {IconPaths} from '@constants/image-paths';
import CollisionBehavior = google.maps.CollisionBehavior;
import {GoogleMapsModule} from '@angular/google-maps';
import {ClickOutsideDirective} from 'directives/click-outside.directive';
import {CategoryService} from '@services/category.service';
import {ICategory} from '@models/category.interface';
import {IMerchant} from '@models/merchant.interface';
import {CdkPortal} from '@angular/cdk/portal';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {AddressDetailComponent} from '@pages/map/address-detail/address-detail.component';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        CommonModule,
        SidebarComponent,
        FilterComponent,
        PersonalGroupsComponent,
        GoogleMapsModule,
        ClickOutsideDirective,
        CdkPortal,
        AddressDetailComponent
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent extends AutomaticallyUnsubscribe implements OnInit {
    @ViewChild(CdkPortal) portal!: CdkPortal;
    private readonly overlay = inject(Overlay);
    private readonly merchantFilterService = inject(MerchantFilterService);
    private readonly categoryService = inject(CategoryService);
    private overlayRef: OverlayRef | null = null;
    selectedMerchant = signal<IMerchant | null>(null);
    isShowMerchantGroups = signal<boolean>(false);
    showMerchantGroupType = signal<EShowMerchantGroupType | null>(null);

    map: google.maps.Map | null = null;
    markers: any[] = [];

    serviceTypes = signal<IServiceType[]>([]);
    subServiceTypes = signal<ISubServiceType[] >([]);
    selectedService = signal<IServiceType | null>(null);
    serviceTypeSelected = ''

    ngOnInit() {
        this.merchantFilterService.selectedMerchant$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((merchant) => {
                this.selectedMerchant.set(merchant);

                if (this.map && merchant) {
                    this.setMarkers(this.map, [merchant]);
                }
            });
        this.merchantFilterService.isShowMerchantGroups$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe(isShowMerchantGroups => {
                this.isShowMerchantGroups.set(isShowMerchantGroups);
            });

        this.merchantFilterService.showMerchantGroupType$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe(showMerchantGroupType => {
                this.showMerchantGroupType.set(showMerchantGroupType);
            });

        this.merchantFilterService.serviceTypes$.subscribe((serviceTypes) => {
            this.serviceTypes.set(serviceTypes);
        });
        this.initMap();
    };

    async onOpenSubServiceTypesModal(service: IServiceType) {
        this.selectedService.set(service);
        const cachedSubServiceTypes = service.subServiceTypes ?? [];
        if (cachedSubServiceTypes.length > 0) {
            this.subServiceTypes.set(cachedSubServiceTypes);
        } else {
            const serviceId = service.id;
            const {code, data} = await firstValueFrom(this.merchantFilterService.getSubServiceTypes(serviceId));
            if (code === '200') {
                this.merchantFilterService.cacheSubServiceTypes(serviceId, data);
                this.subServiceTypes.set(data);
            }
        }
        this.openSubServiceTypesModal();
    }

    onSelectSubServiceType(subService: ISubServiceType) {
        this.merchantFilterService.updateSelectedSubService(subService);
        this.overlayRef?.detach();
    }

    private async initMap() {
        const {AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        const styledMapType = new google.maps.StyledMapType([
            {
                featureType: "road",
                elementType: "labels",
                stylers: [{ visibility: "simplified" }], // Ho?c "off" d? ?n
            },
            {
                featureType: "poi.business",
                elementType: "labels",
                stylers: [{ visibility: "off" }], // ?n qu�n c� ph�
            }
        ]);

        this.map = new google.maps.Map(
            document.getElementById("map") as HTMLElement,
            {
                center: {lat: 21.02930786179391, lng: 105.83593350505639},
                zoom: 15,
                mapId: '4504f8b37365c3d0',

                mapTypeControlOptions: {
                    mapTypeIds: ["roadmap", "styled_map"],
                },
            }
        );
        this.map.mapTypes.set("styled_map", styledMapType);
        this.map.setMapTypeId("styled_map");


        this.markers.push(new AdvancedMarkerElement({
            map: this.map,
            position: {lat: 21.02930786179391, lng: 105.83593350505639},
        }));
        this.map.addListener("zoom_changed", () => this.checkCollisions(this.markers, this.map!));
        this.map.addListener("center_changed", () => this.checkCollisions(this.markers, this.map!));

    }

    private async setMarkers(map: google.maps.Map, merchants: IMerchant[]) {
        const {AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];

        const lat = merchants[0].latitude;
        const lng = merchants[0].longtitude;
        map.panTo({lat, lng});

        merchants.forEach(merchant => {
            const markerContent = this.createShortcutMarker();
            const advancedMarkerElement = new AdvancedMarkerElement({
                map,
                content: markerContent,
                position: {lat: merchant.latitude, lng: merchant.longtitude},
                title: merchant.name,
                collisionBehavior: CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
                zIndex: 1
            });
            this.markers.push(advancedMarkerElement);

            markerContent.addEventListener("mouseenter", () => {
                this.showMoreDetail(advancedMarkerElement);
            });

            markerContent.addEventListener("mouseleave", () => {
                this.hideMoreDetail(advancedMarkerElement);
            });
        });

        this.fitMapToBounds(this.markers, map);

}

    private fitMapToBounds(markers: any[], map: google.maps.Map) {
        if (markers.length === 0) return;

        // Create a new LatLngBounds object
        const bounds = new google.maps.LatLngBounds();

        // Extend the bounds to include each marker's position
        markers.forEach((marker) => {
            bounds.extend(marker.position);
        });

        // Fit the map to the calculated bounds
        map.panToBounds(bounds, 50);
    }

    private toggleHighlight(markerView: any) {
        if (markerView.content.classList.contains('highlight')) {
            markerView.content.classList.remove('highlight');
            markerView.zIndex = null;
        } else {
            markerView.content.classList.add('highlight');
            markerView.zIndex = 1;
        }
    }

    private showMoreDetail(markerView: any) {
        if (!markerView.content.classList.contains('highlight')) {
            markerView.content.classList.add('highlight');
            markerView.zIndex = 1;
        }
    }
    private hideMoreDetail(markerView: any) {
        if (markerView.content.classList.contains('highlight')) {
            markerView.content.classList.remove('highlight');
            markerView.zIndex = null;
        }
    }

    private createShortcutMarker() {

        const content = document.createElement("div");
        content.classList.add("property");
        content.innerHTML = `
            <div class="position-fixed border bg-white merchant">
                <div
                    class="position-relative merchant-avatar"
                    style="background-image: url(https://img.tripi.vn/cdn-cgi/image/width=1280,height=1280/https://googleapis.tripi.vn/download/storage/v1/b/hotelcdn/o/1870%2F1LV0DXXQJ8_BKV_1468-HDR.jpg?generation=1587028250082357&alt=media)"
                >
                </div>
                <div class="p-3">
                    <div class="lh-1 d-flex align-items-center justify-content-between">
                        <h5 class="c-text-truncate fw-500 merchant-name">Var Cyber Gaming</h5>
                        <button class="p-0 c-text-gray btn btn-add-to-favorites">

                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor"><path d="m480-146.93-44.15-39.69q-99.46-90.23-164.5-155.07-65.04-64.85-103.08-115.43-38.04-50.57-53.15-92.27Q100-591.08 100-634q0-85.15 57.42-142.58Q214.85-834 300-834q52.38 0 99 24.5t81 70.27q34.38-45.77 81-70.27 46.62-24.5 99-24.5 85.15 0 142.58 57.42Q860-719.15 860-634q0 42.92-15.12 84.61-15.11 41.7-53.15 92.27-38.04 50.58-102.89 115.43Q624-276.85 524.15-186.62L480-146.93Zm0-81.07q96-86.38 158-148.08 62-61.69 98-107.19t50-80.81q14-35.3 14-69.92 0-60-40-100t-100-40q-47.38 0-87.58 26.88-40.19 26.89-63.65 74.81h-57.54q-23.85-48.31-63.85-75Q347.38-774 300-774q-59.62 0-99.81 40Q160-694 160-634q0 34.62 14 69.92 14 35.31 50 80.81t98 107q62 61.5 158 148.27Zm0-273Z"/></svg>
                    </button>
                    </div>
                    <div class="d-flex align-items-center gap-2 c-text-gray">
                        <span>5.0</span>
                        <div class="d-flex star-icons">
                            <span class="star-icon">${IconPaths.STAR_SM}</span>
                            <span class="star-icon">${IconPaths.STAR_SM}</span>
                            <span class="star-icon">${IconPaths.STAR_SM}</span>
                            <span class="star-icon">${IconPaths.STAR_SM}</span>
                            <span class="star-icon">${IconPaths.STAR_SM}</span>
                        </div>
                        <span>(52)</span>
                    </div>
                    <p class="c-text-gray merchant-address">27 Tr?n Duy Hung, qu?n C?u Gi?y, TP H� N?i</p>
                </div>
            </div>
        `;
        return content;
    }

    private getPixelDistance(pos1: any, pos2: any, map: google.maps.Map) {
        const projection = map.getProjection();
        if (projection) {
            const point1 = projection.fromLatLngToPoint(pos1);
            const point2 = projection.fromLatLngToPoint(pos2);

            if (!point1 || !point2) return 0;
            const scale = Math.pow(2, map.getZoom() ?? 15); // Scale for current zoom level
            const pixel1 = { x: point1.x * scale, y: point1.y * scale };
            const pixel2 = { x: point2.x * scale, y: point2.y * scale };
            return Math.sqrt(Math.pow(pixel1.x - pixel2.x, 2) + Math.pow(pixel1.y - pixel2.y, 2));
        }
        return 0;

    }

    private checkCollisions(markers: any[], map: google.maps.Map) {
        for (let i = 0; i < markers.length; i++) {
            const marker1 = markers[i];
            let collisionDetected = false;

            for (let j = 0; j < markers.length; j++) {
                if (i === j) continue;

                const marker2 = markers[j];
                const distance = this.getPixelDistance(marker1.position, marker2.position, map);

                if (distance < 100) { // Threshold for collision in pixels
                    collisionDetected = true;
                    break;
                }
            }

            // Hide or show title based on collision
            const title = (marker1.content as HTMLElement).querySelector('.title');
            if (title) {
                (title as HTMLElement).style.display = collisionDetected ? "none" : "block";
            }
        }
    }

    private openSubServiceTypesModal() {
        const config: OverlayConfig = {
            hasBackdrop: true,
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
        };
        this.overlayRef = this.overlay.create(config);
        this.overlayRef.attach(this.portal);
        this.overlayRef.backdropClick().subscribe(() => {
            this.overlayRef?.detach();
        });
    }

}
