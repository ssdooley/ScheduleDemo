import { Component, OnInit } from '@angular/core';
import { CommitmentService } from '../../services/commitment.service';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';
import { Commitment } from '../../models/commitment.model';

@Component({
    selector: 'commitments',
    templateUrl: './commitments.component.html',
    providers: [
        CommitmentService,
        PersonService
    ]
})
export class CommitmentsComponent implements OnInit {
    commitments: Array<Commitment> = new Array<Commitment>();
    people: Array<Person> = new Array<Person>();
    person: Person;
    commitment: Commitment = new Commitment();
    isPersonal: boolean = false;

    constructor(private commitmentService: CommitmentService, private personService: PersonService) {
        commitmentService.commitments.subscribe(commitments => {
            this.commitments = commitments;
        });

        personService.people.subscribe(people => {
            this.people = people;
        });

        this.commitment.people = new Array<Person>();
    }

    ngOnInit() {
        this.commitmentService.getCommitments();
        this.personService.getPeople();
    };

    addCommitmentPerson(person: Person) {
        this.person.id = person.id;
        this.person.name = person.name;
    }

    addSelectedPerson() {
        let index = this.commitment.people.indexOf(this.person);

        if (index < 0) {
            this.commitment.people.push(this.person)
        }
    }

    createCommitment() {
        this.commitmentService.addCommitment(this.commitment);
    }

    removePerson(person: Person) {
        let index = this.commitment.people.indexOf(this.person);
        this.commitment.people.splice(index, 1);
    }

    retrievePersonalCommitments() {
        this.isPersonal = true;
        this.commitmentService.getPersonalCommitments(this.person.id);
    }

    clearPersonalCommitments() {
        this.isPersonal = false;
        this.person = new Person();
        this.commitmentService.getCommitments();
    }
}