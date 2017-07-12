import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Commitment } from '../models/commitment.model';
import { ToastrService } from './toastr.service';

@Injectable()
export class CommitmentService {
    constructor(private http: Http, private toastrService: ToastrService) { }

    private commitmentsSubject = new Subject<Array<Commitment>>();
    private commitmentSubject = new Subject<Commitment>();
    private newCommitmentSubject = new Subject<Commitment>();

    commitments = this.commitmentsSubject.asObservable();
    commitment = this.commitmentSubject.asObservable();
    newCommitment = this.newCommitmentSubject.asObservable();

    getCommitments(): void {
        this.http.get('/api/commitment/getCommitments')
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(commitments => {
                this.commitmentsSubject.next(commitments);
            },
            error => {
                this.toastrService.alertDanger(error, "Get Commitments Error");
            });
    }

    getPersonalCommitments(id: number): void {
        this.http.get('/api/commitment/getPersonalCommitments/' + id)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(commitments => {
                this.commitmentsSubject.next(commitments);
            },
            error => {
                this.toastrService.alertDanger(error, "Get Commitments Error");
            });
    }

    getCommitment(id: number): void {
        this.http.get('/api/Commitments/GetSimpleCommitment/' + id)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(commitment => {
                this.commitmentSubject.next(commitment);
            },
            error => {
                this.toastrService.alertDanger(error, "Get Person Error");
            });
    }

    addCommitment(model: Commitment) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model);

        return this.http.post('/api/Commitments/AddCommitment', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getCommitments();
                this.newCommitmentSubject.next(new Commitment());
                this.toastrService.alertSuccess(model.category + " successfully added", "Add Person");
            },
            error => {
                this.toastrService.alertDanger(error, "Add Person Error");
            });
    }

    updateCommitment(model: Commitment) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model);

        return this.http.post('/api/Commitments/UpdateCommitment', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getCommitments();
                this.toastrService.alertSuccess(model.category + " successfully updated", "Update Commitment");
            },
            error => {
                this.toastrService.alertDanger(error, "Update Commitment Error");
            });
    }

    deleteCommitment(model: Commitment) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(model.id);

        return this.http.post('/api/Commitments/DeleteCommitment', body, options)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(res => {
                this.getCommitments();
                this.toastrService.alertSuccess(model.category + " successfully deleted", "Delete Commitment");
            },
            error => {
                this.toastrService.alertDanger(error, "Delete Commitment Error");
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