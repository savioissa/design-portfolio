import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { SkillsComponent } from './pages/skills/skills.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sobre-mim', component: AboutComponent },
  { path: 'habilidades-e-formacao', component: SkillsComponent },
  { path: '**', redirectTo: '' },
];
