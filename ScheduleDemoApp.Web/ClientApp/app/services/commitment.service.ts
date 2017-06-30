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

    commitments = this.commitmentsSubject.asObservable();

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