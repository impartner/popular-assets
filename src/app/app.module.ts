import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StyleType } from '@impartner/angular-apps';
import { ImpartnerI18NextModule } from '@impartner/angular-apps/i18n';
import { LocalImpartnerWidgetModule } from '@impartner/angular-apps/local-dev';
import { ImpartnerSdkModule } from '@impartner/angular-sdk';
import {
  AbstractImpartnerWidgetAppModule,
  ImpartnerWidgetModule
} from '@impartner/angular-apps/widget';
import { Resource } from 'i18next';

import { environment } from '../environments/environment';
import * as translations from '../translations.json';
import { PopularAssetsEditComponent, PopularAssetsViewComponent } from './popular-assets';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    ImpartnerSdkModule.forRoot({ ...environment }),
    ImpartnerI18NextModule.forRoot({
      resources: translations as Resource,
      defaultNS: 'popularAssets'
    }),
    ImpartnerWidgetModule.forRoot(environment, {
      isCustom: true,
      widgetDefinition: {
        name: 'Popular Assets',
        type: 'custom.popular-assets',
        style: StyleType.ImpartnerHex,
        modeComponents: {
          view: {
            componentType: PopularAssetsViewComponent,
            webComponentTag: 'uw-popular-assets-view'
          },
          edit: {
            componentType: PopularAssetsEditComponent,
            webComponentTag: 'uw-popular-assets-edit'
          }
        }
      }
    }),
    environment.production
      ? []
      : LocalImpartnerWidgetModule.forRoot(environment, {
          defaultTenantId: 40
        })
  ],
  providers: []
})
export class AppModule extends AbstractImpartnerWidgetAppModule {}
