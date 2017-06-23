import { Component } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'add-category',
    templateUrl: './add-category.component.html'
})
export class AddCategoryComponent {
    category: Category = new Category();

    constructor(private categoryService: CategoryService) {
        this.categoryService.newCategory.subscribe(category => {
            this.category = category;
        });
    }

    createCategory() {
        this.categoryService.addCategory(this.category);
    }
}