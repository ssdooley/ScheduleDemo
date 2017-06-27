import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Person } from '../models/person.model';
import { ToastrService } from './toastr.service';

@Injectable()
export class PersonService {
    constructor(private http: Http, private toastrService: ToastrService) { }

    private peopleSubject = new Subject<Array<Person>>();
    private personSubject = new Subject<Person>();
    private newPersonSubject = new Subject<Person>();

    people = this.peopleSubject.asObservable();
    person = this.personSubject.asObservable();
    newPerson = this.newPersonSubject.asObservable();

    getPeople(): void {
        this.http.get('/api/People/GetSimplePeople')
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(people => {
                this.peopleSubject.next(people);
            },
            error => {
                this.toastrService.alertDanger(error, "Get People Error");
            });
    }

    getPerson(id: number): void {
        this.http.get('/api/People/GetSimplePerson/' + id)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(person => {
                this.personSubject.next(person);
            },
            error => {
                this.toastrService.alertDanger(error, "Get Person Error");
            });
    }

    addPerson(model: Person) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model);

        return this.http.post('/api/People/AddPerson', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getPeople();
                this.newPersonSubject.next(new Person());
                this.toastrService.alertSuccess(model.name + " successfully added", "Add Person");
            },
            error => {
                this.toastrService.alertDanger(error, "Add Person Error");
            });
    }

    updatePerson(model: Person) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model);

        return this.http.post('/api/People/UpdatePerson', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getPeople();
                this.toastrService.alertSuccess(model.name + " successfully updated", "Update Person");
            },
            error => {
                this.toastrService.alertDanger(error, "Update Person Error");
            });
    }

    deletePerson(model: Person) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model.id);

        return this.http.post('/api/People/DeletePerson', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getPeople();
                this.toastrService.alertSuccess(model.name + " successfully deleted", "Delete Person");
            },
            error => {
                this.toastrService.alertDanger(error, "Delete Person Error");
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
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}