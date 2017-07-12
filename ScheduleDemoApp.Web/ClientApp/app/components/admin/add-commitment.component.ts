import { Component } from '@angular/core';
import { Commitment } from '../../models/commitment.model';
import { CommitmentService } from '../../services/commitment.service';

@Component({
    selector: 'add-commitment',
    templateUrl: './add-commitment.component.html'
})
export class AddCommitmentComponent {
    commitment: Commitment = new Commitment();

    constructor(private commitmentService: CommitmentService) {
        this.commitmentService.newCommitment.subscribe(commitment => {
            this.commitment = commitment;
        });
    }

    createPerson() {
        this.commitmentService.addCommitment(this.commitment);
    }
}