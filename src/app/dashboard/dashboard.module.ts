import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NavComponent } from './nav/nav.component';
import { DashboardRootComponent } from './dashboard-root/dashboard-root.component';
import { BrowseComponent } from './browse/browse.component';
import { GenreComponent } from './genre/genre.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [NavComponent, DashboardRootComponent, BrowseComponent, GenreComponent]
})
export class DashboardModule { }