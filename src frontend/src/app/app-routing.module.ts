import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistracijaComponent } from './registracija/registracija.component';
import { LoginComponent } from './login/login.component';
import { GostComponent } from './gost/gost.component';
import { RegKorComponent } from './reg-kor/reg-kor.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { PretragaComponent } from './pretraga/pretraga.component';
import { PrikazKnjigeComponent } from './prikaz-knjige/prikaz-knjige.component';
import { IzmenaComponent } from './izmena/izmena.component';
import { ProfiliComponent } from './profili/profili.component';
import { DodajKnjiguComponent } from './dodaj-knjigu/dodaj-knjigu.component';
import { OdobriKnjigeComponent } from './odobri-knjige/odobri-knjige.component';
import { OdobriRegComponent } from './odobri-reg/odobri-reg.component';
import { PromeniTipComponent } from './promeni-tip/promeni-tip.component';
import { IzmeniKnjiguComponent } from './izmeni-knjigu/izmeni-knjigu.component';



const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'registracija', component: RegistracijaComponent},
  {path:'login', component: LoginComponent},
  {path:'gost', component: GostComponent},
  {path:'reg-kor', component: RegKorComponent},
  {path:'promena-lozinke', component: PromenaLozinkeComponent},
  {path: 'pretraga', component: PretragaComponent},
  {path: 'prikaz-knjige', component: PrikazKnjigeComponent},
  {path: 'izmena', component: IzmenaComponent},
  {path: 'profili', component: ProfiliComponent},
  {path: 'dodaj-knjigu', component: DodajKnjiguComponent},
  {path: 'odobri-knjigu', component: OdobriKnjigeComponent},
  {path: 'odobri-reg', component: OdobriRegComponent},
  {path: 'promeni-tip', component: PromeniTipComponent},
  {path: 'izmeniK', component: IzmeniKnjiguComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
