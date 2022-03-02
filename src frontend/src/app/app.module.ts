import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { LoginComponent } from './login/login.component';
import { GostComponent } from './gost/gost.component';
import { RegKorComponent } from './reg-kor/reg-kor.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { RecaptchaModule} from 'ng-recaptcha';
import { PretragaComponent } from './pretraga/pretraga.component';
import { PrikazKnjigeComponent } from './prikaz-knjige/prikaz-knjige.component';
import { IzmenaComponent } from './izmena/izmena.component';
import { ProfiliComponent } from './profili/profili.component';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { DodajKnjiguComponent } from './dodaj-knjigu/dodaj-knjigu.component';
import { OdobriKnjigeComponent } from './odobri-knjige/odobri-knjige.component';
import { OdobriRegComponent } from './odobri-reg/odobri-reg.component';
import { PromeniTipComponent } from './promeni-tip/promeni-tip.component';
import { IzmeniKnjiguComponent } from './izmeni-knjigu/izmeni-knjigu.component';
 
@NgModule({
  declarations: [
    AppComponent,
    RegistracijaComponent,
    LoginComponent,
    GostComponent,
    RegKorComponent,
    PromenaLozinkeComponent,
    PretragaComponent,
    PrikazKnjigeComponent,
    IzmenaComponent,
    ProfiliComponent,
    DodajKnjiguComponent,
    OdobriKnjigeComponent,
    OdobriRegComponent,
    PromeniTipComponent,
    IzmeniKnjiguComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    RecaptchaModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
