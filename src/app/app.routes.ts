import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { SolveComponent } from './pages/solve/solve.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sobre-mim', component: AboutComponent, data: { footer: false } },
  { path: 'habilidades-e-formacao', component: SkillsComponent, data: { footer: false } },
  { path: 'como-resolvo-problemas', component: SolveComponent, data: { footer: false } },
  { path: 'projetos', component: ProjectsComponent, data: { footer: false } },
  { path: '**', redirectTo: '' },
];
