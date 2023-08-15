import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import {
  IImpartnerRouter,
  IMPARTNER_ROUTER_TOKEN,
} from '@impartner/angular-sdk';

import { AssetService } from '../../services';

@Component({
  selector: 'app-asset-display',
  templateUrl: './asset-display.component.html',
  styleUrls: ['./asset-display.component.scss'],
})
export class AssetDisplayComponent implements OnInit {
  @Input()
  public id: number = 0;

  @Input()
  public name: string = '';

  @Input()
  public downloadCount: number = 0;

  @Input()
  public extension: string = '';

  @Input()
  public totalLikes: number = 0;

  @Input()
  public viewCount: number = 0;

  @Input()
  public code: string = '';

  @Input()
  public contentType: string = '';

  @Input()
  public sharedCount: number = 0;

  @Input()
  public sharedHitCount: number = 0;

  @HostBinding('class.asset-display')
  public get hostClass(): boolean {
    return true;
  }

  public src: string = '';
  public downloadUrl: string = '';
  public validThumbnail = true;

  constructor(
    private readonly _assetService: AssetService,
    @Inject(IMPARTNER_ROUTER_TOKEN)
    private readonly _impartnerRouter: IImpartnerRouter
  ) {}

  ngOnInit(): void {
    this.src = this._assetService.getThumbnailSrcUrl(this.id);
    this.downloadUrl = this._assetService.getDownloadUrl(this.code);
  }

  public navigateToAsset(): void {
    this._impartnerRouter.navigate(`s/assets?id=${this.id}`, undefined, {
      openNewTab: true,
    });
  }
}
