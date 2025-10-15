import { Injectable, OnDestroy } from '@angular/core';
import { ImpartnerObjectService } from '@impartner/angular-sdk';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { IAsset, IAssetCollection } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AssetService implements OnDestroy {
  public collections$: BehaviorSubject<IAssetCollection[]> = new BehaviorSubject<
    IAssetCollection[]
  >([]);
  public assets$: BehaviorSubject<IAsset[]> = new BehaviorSubject<IAsset[]>([]);
  public collection$: BehaviorSubject<IAssetCollection | undefined> = new BehaviorSubject<
    IAssetCollection | undefined
  >(undefined);

  private baseUrl = '/prm/api/objects/v1/asset/';
  private _onDestroy$ = new Subject<void>();

  constructor(private readonly impartnerObjectService: ImpartnerObjectService) {}

  public getAssets(collection: string): void {
    let filter = `isActive = true and assetStatus = 'Published'`;

    if (collection) {
      filter += ` and collection.id = ${collection}`;
    }

    this.impartnerObjectService
      .getMany<IAsset>('Asset', {
        fields: [
          'id',
          'name',
          'downloadCount',
          'extension',
          'totalLikes',
          'viewCount',
          'code',
          'contentType',
          'sharedCount',
          'sharedHitCount'
        ],
        filter,
        take: 5,
        orderBy: [
          {
            field: 'downloadCount',
            direction: 'desc'
          }
        ]
      })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(result => {
        const records = [...(result.data?.results || [])];
        this.assets$.next(records);
      });
  }

  public getAssetCollections(): void {
    this.impartnerObjectService
      .getMany<IAssetCollection>('AssetCollection', {
        fields: ['id', 'name', 'assetCount'],
        take: 1000
      })
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(result => {
        const records = [...(result.data?.results || [])];
        this.collections$.next(records);
      });
  }

  public getAssetCollection(id: string): void {
    this.impartnerObjectService
      .get<IAssetCollection>('AssetCollection', id)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(result => {
        this.collection$.next(result.data);
      });
  }

  public getDownloadUrl(code: string): string {
    return `${this.baseUrl}${code}/_download`;
  }

  public getThumbnailSrcUrl(id: number): string {
    return `${this.baseUrl}${id}/_thumb`;
  }

  public ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
}
