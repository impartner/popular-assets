import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImpartnerI18NextModule } from '@impartner/angular-apps/i18n';
import { BaseWidgetEditComponent } from '@impartner/angular-apps/widget';
import {
  IAppLanguage,
  IImpartnerLogger,
  IMPARTNER_LOGGER_TOKEN,
  ImpartnerConfigService,
  ImpartnerEventBusService
} from '@impartner/angular-sdk';
import { ImpdcFormsModule } from '@impartner/design-components';
import { debounceTime, takeUntil } from 'rxjs';

import { DEFAULT_WIDGET_CONFIG } from '../../constants';
import { IAssetCollection, IPopularAssetsConfig } from '../../interfaces';
import { AssetService } from '../../services';

@Component({
  selector: 'app-popular-assets-edit',
  templateUrl: './popular-assets-edit.component.html',
  styleUrls: ['./popular-assets-edit.component.scss'],
  imports: [ImpartnerI18NextModule, ImpdcFormsModule, ReactiveFormsModule]
})
export class PopularAssetsEditComponent
  extends BaseWidgetEditComponent<IPopularAssetsConfig>
  implements OnInit
{
  public collections: IAssetCollection[] = [];
  public form: FormGroup = new FormGroup({
    collectionId: new FormControl(''),
    currentLocale: new FormControl('en')
  });
  public languages: IAppLanguage[] = [];

  constructor(
    impartnerEventBus: ImpartnerEventBusService,
    impartnerConfig: ImpartnerConfigService,
    @Inject(IMPARTNER_LOGGER_TOKEN) impartnerLogger: IImpartnerLogger,
    changeDetectorRef: ChangeDetectorRef,
    private readonly _assetService: AssetService
  ) {
    super(
      impartnerEventBus,
      impartnerConfig,
      impartnerLogger,
      changeDetectorRef,
      DEFAULT_WIDGET_CONFIG
    );
  }

  public ngOnInit(): void {
    this._setUpForm();
    this._fetchCollections();
  }

  private _fetchCollections(): void {
    this._assetService.collections$.pipe(takeUntil(this.onDestroy$)).subscribe(collections => {
      this.collections = collections;
      this._changeDetectorRef.detectChanges();
    });

    this._assetService.getAssetCollections();
  }

  private _setUpForm(): void {
    this.form.patchValue({ collectionId: this.widgetConfig.collectionId });

    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
      this.widgetConfig.collectionId = value.collectionId;

      this.emitUpdatedWidgetConfigEvent(this.widgetConfig);
    });

    this._setUpLocalizationForm();
  }

  private _setUpLocalizationForm(): void {
    this.languages = Object.values(this._impartnerConfig.getConfig().languages);

    this.languages.forEach(language => {
      const controlName = `${language.locale}_description`;
      this.form.addControl(
        controlName,
        new FormControl(this.localization![language.locale]['description'] || '')
      );
      this.form.controls[controlName].valueChanges
        .pipe(takeUntil(this.onDestroy$), debounceTime(500))
        .subscribe(value => {
          this.localization![language.locale]['description'] = value;

          this.emitUpdatedLocalizationEvent(this.localization!);
        });
    });
  }
}
