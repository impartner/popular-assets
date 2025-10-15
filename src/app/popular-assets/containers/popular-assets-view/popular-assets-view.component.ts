import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ImpartnerI18NextModule } from '@impartner/angular-apps/i18n';
import { BaseWidgetComponent } from '@impartner/angular-apps/widget';
import {
  IImpartnerLogger,
  IMPARTNER_LOGGER_TOKEN,
  ImpartnerConfigService
} from '@impartner/angular-sdk';
import { takeUntil } from 'rxjs';

import { IAsset, IPopularAssetsConfig } from '../../interfaces';
import { AssetDisplayComponent } from '../../components';
import { DEFAULT_WIDGET_CONFIG } from '../../constants';
import { AssetService } from '../../services';
import { ScrollableModule } from '@impartner/design-components';

@Component({
  selector: 'app-popular-assets-view',
  templateUrl: './popular-assets-view.component.html',
  styleUrls: ['./popular-assets-view.component.scss'],
  imports: [AssetDisplayComponent, ImpartnerI18NextModule, ScrollableModule]
})
export class PopularAssetsViewComponent
  extends BaseWidgetComponent<IPopularAssetsConfig>
  implements OnInit, OnDestroy
{
  public assets: IAsset[] = [];
  public description: string = '';
  public collectionName: string = '';

  constructor(
    impartnerConfig: ImpartnerConfigService,
    @Inject(IMPARTNER_LOGGER_TOKEN) impartnerLogger: IImpartnerLogger,
    changeDetectorRef: ChangeDetectorRef,
    private readonly _assetService: AssetService,
    private readonly _impartnerConfigService: ImpartnerConfigService
  ) {
    super(impartnerConfig, impartnerLogger, changeDetectorRef, DEFAULT_WIDGET_CONFIG);
  }

  public ngOnInit(): void {
    this._fetchAssets();
    this._fetchCollection();
    this.description = this.getConfiguredLocalizedDescription();
  }

  private _fetchAssets(): void {
    this._assetService.assets$.pipe(takeUntil(this.onDestroy$)).subscribe(assets => {
      this.assets = assets;
      this._changeDetectorRef.detectChanges();
    });

    this._assetService.getAssets(this.widgetConfig.collectionId);
  }

  private _fetchCollection(): void {
    this._assetService.collection$.pipe(takeUntil(this.onDestroy$)).subscribe(collection => {
      if (collection) {
        this.collectionName = collection.name;
      }
      this._changeDetectorRef.detectChanges();
    });

    if (this.widgetConfig.collectionId) {
      this._assetService.getAssetCollection(this.widgetConfig.collectionId);
    }
  }

  private getConfiguredLocalizedDescription(): string {
    const currentLocale = this._impartnerConfigService.getConfig().currentLanguage.locale;
    if (
      !this.localization ||
      !this.localization[currentLocale] ||
      !this.localization[currentLocale]['description']
    ) {
      return 'Check out these five popular assets.';
    }

    return this.localization[currentLocale]['description'];
  }
}
