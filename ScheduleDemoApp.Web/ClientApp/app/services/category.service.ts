import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Category } from '../models/category.model';
import { ToastrService } from './toastr.service';

@Injectable()
export class CategoryService {
    constructor(private http: Http, private toastrService: ToastrService) { }

    private categoriesSubject = new Subject<Array<Category>>();
    private categorySubject = new Subject<Category>();
    private newCategorySubject = new Subject<Category>();

    categories = this.categoriesSubject.asObservable();
    category = this.categorySubject.asObservable();
    newCategory = this.newCategorySubject.asObservable();

    getCategories(): void {
    this.http.get('/api/Category/GetSimpleCategories')
        .map(this.extractData)
        .catch(this.handleError)
        .subscribe(categories => {
            this.categoriesSubject.next(categories);
        },
        error => {
            this.toastrService.alertDanger(error, "Get Categories Error");
        });
    }

    getCategory(id: number): void {
        this.http.get('api/Category/GetSimpleCategory/' + id)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(category => {
                this.categorySubject.next(category);
            },
            error => {
                this.toastrService.alertDanger(error, "Get Category Error");
            });
    }

    addCategory(model: Category) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model);

        return this.http.post('/api/Category/AddCategory', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getCategories();
                this.newCategorySubject.next(new Category());
                this.toastrService.alertSuccess(model.name + " successfully added", "Add Category");
            },
            error => {
                this.toastrService.alertDanger(error, "Add Category Error");
            });
    }

    updateCategory(model: Category) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model);

        return this.http.post('/api/Category/UpdateCategory', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getCategories();
                this.toastrService.alertSuccess(model.name + " successfully updated", "Update Category");
            },
            error => {
                this.toastrService.alertDanger(error, "Update Category Error");
                        });
    }

    deleteCategory(model: Category) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model.id);

        return this.http.post('api/Category/DeleteCategory', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getCategories();
                this.toastrService.alertSuccess(model.name + " succussfully deleted", "Delete Category");
            },
        error => {
            this.toastrService.alertDanger(error, "Delete Category Error");
        });
    }



    private extractData(res: Response) {
        return res.json() || {};
    }


    private handleError(error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText} || ''} ${err}`;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
