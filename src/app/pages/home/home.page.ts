import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { GithubAPIService } from 'src/app/services/github-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  user: User = null;
  error: boolean = false;
  form : FormGroup;
  name : FormControl;
  isLoading = false;

  users$ : Observable<User>;
  username : string;

  constructor(private githubService : GithubAPIService) {

    this.form = new FormGroup({
      name: new FormControl('')
    });

  }

  ngOnInit() {
  }


  onSearch(){
    this.username = this.form.get('name').value;

    this.users$ = this.githubService.getUser(this.username)
    .pipe(
      catchError( err => {
        console.log(err);
        
        this.user = null;
        this.error = err;
        return EMPTY;
      }),
    );
  }

}
