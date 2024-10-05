import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundsHomeComponent } from './funds-home/funds-home.component';
import { AddFundsComponent } from './add-funds/add-funds.component';

const routes: Routes = [
  { path: 'funds', component: FundsHomeComponent },
  { path: 'new-funds', component: AddFundsComponent },
  { path: '', redirectTo: '/funds', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
