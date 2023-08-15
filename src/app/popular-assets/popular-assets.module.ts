import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImpartnerI18NextModule } from '@impartner/angular-apps/i18n';
import {
  DesignComponentsModule,
  ImpdcFormsModule,
  ScrollableModule,
} from '@impartner/design-components';

import {
  PopularAssetsEditComponent,
  PopularAssetsViewComponent,
} from './containers';
import { AssetDisplayComponent } from './components';

@NgModule({
  declarations: [
    PopularAssetsEditComponent,
    PopularAssetsViewComponent,
    AssetDisplayComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DesignComponentsModule,
    ImpdcFormsModule,
    ImpartnerI18NextModule,
    ScrollableModule
  ],
  exports: [PopularAssetsEditComponent, PopularAssetsViewComponent],
})
export class PopularAssetsModule {}
