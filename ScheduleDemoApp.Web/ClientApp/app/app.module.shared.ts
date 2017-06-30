import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ToastrService } from './services/toastr.service';

import { AppComponent } from './components/app/app.component'
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { PeopleComponent } from './components/admin/people.component';
import { CategoriesComponent } from './components/admin/categories.component';
import { AddPersonComponent } from './components/admin/add-person.component';
import { PersonListComponent } from './components/admin/person-list.component';
import { AddCategoryComponent } from './components/admin/add-category.component';
import { CategoryListComponent } from './components/admin/category-list.component';
import { CommitmentsComponent } from './components/commitment/commitments.component';


export const sharedConfig: NgModule = {
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        HomeComponent,
        AdminComponent,
        PeopleComponent,
        CategoriesComponent,
        AddPersonComponent,
        PersonListComponent,
        AddCategoryComponent,
        CategoryListComponent,
        CommitmentsComponent
    ],
    providers: [
        ToastrService
    ],
    imports: [
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            {
                path: 'admin',
                component: AdminComponent,
                children: [
                    {
                        path: 'people',
                        component: PeopleComponent                        
                    },
                    {
                        path: 'categories',
                        component: CategoriesComponent
                    }
                ]
            },
            { path: '**', redirectTo: 'home' }
        ])
    ]
};
