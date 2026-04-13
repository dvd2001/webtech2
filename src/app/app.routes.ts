import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard-component/dashboard.component';
import { LoginComponent } from './components/login-component/login.component';
import { RegistrationComponent } from './components/registration-component/registration.component';
import { ProductCreateComponent } from './components/product-create-component/product-create.component';
import { ProductListComponent } from './components/product-list-component/product-list.component';
import { ProductEditComponent } from './components/product-edit-component/product-edit.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'products/create', component: ProductCreateComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'products/:id/edit', component: ProductEditComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
