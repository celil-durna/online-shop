import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';  
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckoutWizardComponent } from './checkout-wizard/checkout-wizard.component';
import { SuccessPageComponent } from './success-page/success-page.component';


export const routes: Routes = [
  { path: '', 
    component: ProductListComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent, // register route added for assignment 1 
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent
  },
  {
  path: 'cart',
  component: CartPageComponent,
  },
  {
    path: 'checkout',
    component: CheckoutWizardComponent,
  },
  {
    path: 'success',
    component: SuccessPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
