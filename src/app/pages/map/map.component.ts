import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    Renderer2,
    signal,
    ViewChild
} from '@angular/core';
import {firstValueFrom, takeUntil} from 'rxjs';
import {CommonModule} from '@angular/common';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {CdkPortal} from '@angular/cdk/portal';
import {GoogleMapsModule} from '@angular/google-maps';

// Services
import {
    EShowMerchantGroupType, ESystemMerchantGroupType, IMerchantGroup,
    IServiceType,
    MerchantFilterService
} from '@services/merchant-filter.service';
import {CategoryService} from '@services/category.service';

// Components
import {AutomaticallyUnsubscribe} from '@constants/automatically-unsubscribe';
import {SidebarComponent} from '@pages/map/sidebar/sidebar.component';
import {FilterComponent} from '@pages/map/filter/filter.component';
import {PersonalGroupsComponent} from '@pages/map/personal-groups/personal-groups.component';
import {AddressDetailComponent} from '@pages/map/address-detail/address-detail.component';

// Models
import {IconPaths} from '@constants/image-paths';
import {IMerchant} from '@models/merchant.interface';

import CollisionBehavior = google.maps.CollisionBehavior;
import {Swiper} from 'swiper';
import {ShowAllServiceTypeComponent} from '@pages/map/category/show-all-service-type/show-all-service-type.component';
import {Dialog} from '@angular/cdk/dialog';
import {ISubServiceType} from '@models/category.interface';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        CommonModule,
        SidebarComponent,
        FilterComponent,
        PersonalGroupsComponent,
        GoogleMapsModule,
        CdkPortal,
        AddressDetailComponent
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent extends AutomaticallyUnsubscribe implements OnInit, AfterViewInit {
    @ViewChild(CdkPortal) portal!: CdkPortal;
    private readonly renderer = inject(Renderer2);
    private readonly overlay = inject(Overlay);
    private readonly merchantFilterService = inject(MerchantFilterService);
    private readonly categoryService = inject(CategoryService);
    private overlayRef: OverlayRef | null = null;
    selectedMerchant = signal<IMerchant | null>(null);
    merchantGroups = signal<IMerchantGroup[]>([]);
    private readonly dialog = inject(Dialog);
    isShowMerchantGroups = signal<boolean>(false);
    showMerchantGroupType = signal<EShowMerchantGroupType | null>(null);

    map: google.maps.Map | null = null;
    markers: any[] = [];

    mapMerchantsFavourite = signal< Map<string, string>>(new Map());
    serviceTypes = signal<IServiceType[]>([]);
    subServiceTypes = signal<ISubServiceType[]>([]);
    selectedService = signal<IServiceType | null>(null);
    showAllServiceType = signal(true);

    serviceTypeSelected = '';


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

        this.merchantFilterService.serviceTypes$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((serviceTypes) => {
                this.serviceTypes.set(serviceTypes);
            });

        this.merchantFilterService.merchantGroups_v2$
            .pipe(takeUntil(this.destroyFlag))
            .subscribe((merchantGroups) => {
                const favoriteMerchants = merchantGroups.find(it => it.id === ESystemMerchantGroupType.FAVORITES);
                if (favoriteMerchants) {
                    this.mapMerchantsFavourite.set(
                        new Map(favoriteMerchants.merchants.map((it: { id: any; }) => [it.id, it.id]))
                    );
                }

                if (this.map) {
                    const selectedGroupMerchants = merchantGroups.find(it => it.selected);
                    const merchants = selectedGroupMerchants?.merchants ?? [];
                    this.setMarkers(this.map, merchants);
                }

            });

        this.initMap();
    };

    ngAfterViewInit() {
        new Swiper("#btnTest", {
            slidesPerView: 3,
            spaceBetween: 16,
            mousewheel: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }

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
                stylers: [{visibility: "simplified"}], // Ho?c "off" d? ?n
            },
            {
                featureType: "poi.business",
                elementType: "labels",
                stylers: [{visibility: "off"}], // ?n qu�n c� ph�
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
            const markerContent = this.createShortcutMarker(merchant);
            const advancedMarkerElement = new AdvancedMarkerElement({
                map,
                content: markerContent,
                position: {lat: merchant.latitude, lng: merchant.longtitude},
                title: merchant.name,
                collisionBehavior: CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
                zIndex: 1
            });
            this.markers.push(advancedMarkerElement);

            advancedMarkerElement.addListener('click', () => {
                this.merchantFilterService.updateSelectedMerchant(merchant);
            });
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

    private createShortcutMarker(merchant: IMerchant) {
        const isFavorite = this.mapMerchantsFavourite().get(merchant.id);

        const content = document.createElement("div");
        content.classList.add("property");
        content.innerHTML = `
            <div class="position-fixed border bg-white merchant">
                <div
                    class="position-relative merchant-avatar"
                    style="background-image: url('${merchant.avatar}')"
                >
                </div>
                <div class="p-3">
                    <div class="lh-1 d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-2">
                            <div class="py-1 px-1 rounded merchant-discount text-center">${merchant.discountRate}%</div>
                            <h5 class="lh-1 c-text-truncate fw-500 merchant-name">${merchant.name}</h5>
                        </div>

                        <button class="p-0 c-text-gray btn btn-add-to-favorites">

                        ${isFavorite ? IconPaths.FAVOURITE_FILL_LG : IconPaths.FAVOURITE_LG}
                    </button>
                    </div>
                    <div class="d-flex align-items-center gap-2 c-text-gray">
                        <span>${merchant.rating}</span>
                        ${this.renderRatingStars(merchant.rating, merchant.totalRating)}
                        <span>(${merchant.totalRating})</span>
                    </div>
                    <p class="c-text-gray merchant-address">${merchant.fullAddress}</p>
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
            const pixel1 = {x: point1.x * scale, y: point1.y * scale};
            const pixel2 = {x: point2.x * scale, y: point2.y * scale};
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

    private renderRatingStars(rating: number, totalRating: number) {

        let res = `<div class="d-flex star-icons">`;

        const fullStars = Math.floor(rating);
        for (let i = 0; i < fullStars; i++) {
            res += `<i class="bi bi-star-fill"></i>`;
        }

        // Half star
        if (rating % 1 >= 0.5) {
            res += `<i class="bi bi-star-half"></i>`;
        }

        // Empty stars
        const emptyStars = 5 - fullStars - (rating % 1 >= 0.5 ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            res += `<i class="bi bi-star"></i>`;
        }

        return res += '</div>';
    }

     onViewAllModal(){
        this.categoryService.addListServiceType(this.serviceTypes())
        const dialogRef = this.dialog.open(ShowAllServiceTypeComponent, {
            minWidth: '300px',
        });

        dialogRef.closed.subscribe(() => {
            this.showAllServiceType.set(false);
        });
    }

    protected readonly window = window;
}
