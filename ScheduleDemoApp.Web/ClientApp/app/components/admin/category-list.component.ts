import { Component } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'category-list',
    templateUrl: './category-list.component.html'
})
export class CategoryListComponent {
    categories: Array<Category> = new Array<Category>();

    constructor(private categoryService: CategoryService) {
        categoryService.categories.subscribe(categories => {
            this.categories = categories;
        });
    }

    editCategory(category: Category) {
        if (category.name) {
            this.categoryService.updateCategory(category);
        }
    }

    deleteCategory(category: Category) {
        if (category.id) {
            this.categoryService.deleteCategory(category);
        }
    }
}