import { Component,OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'categories',
    templateUrl: './categories.component.html',
    providers: [
        CategoryService
    ]
})
export class CategoriesComponent implements OnInit {
    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.categoryService.getCategories()
    };
}