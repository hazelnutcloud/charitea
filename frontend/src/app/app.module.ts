import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FundsHomeComponent } from './funds-home/funds-home.component';
import { FormsModule } from '@angular/forms';
import { AddFundsComponent } from './add-funds/add-funds.component';

@NgModule({
  declarations: [
    AppComponent,
    FundsHomeComponent,
    AddFundsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
