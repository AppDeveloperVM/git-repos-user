import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { GithubAPIService } from 'src/app/services/github-api.service';
import { Profile } from 'src/app/models/profile.model';
import { Repo } from 'src/app/models/repo.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  user: User = null;
  repos: Repo =  null;
  profile : Profile = null;
  error: boolean = false;
  errorMessage = null;
  form : FormGroup;
  name : FormControl;
  isLoading = false;

  users$ : Observable<User>;
  username : string;

  constructor(private githubService : GithubAPIService) {
    this.form = new FormGroup({
      name: new FormControl('')
    });

    this.profile = new Profile();
    this.profile.user = new User();
    this.profile.repos = new Array();
  }

  ngOnInit() {
  }

  onKeyDownEvent(event: any){
    try {
      if(event == null) return;
      if(event.code == "Enter"){
        this.onSearch();
      }
    }catch(err){
      console.log(err);
      
    }
  }

  onSearch(){
    this.username = this.form.get('name').value;
    
    if(this.username == null) return;

    const Userpromise = new Promise((resolve,reject) => {

      this.githubService.getUser(this.username)
      .pipe(
        catchError( err => {
          console.log(err);
          
          this.user = null;
          this.error = err;

          this.handleError(err);

          reject(err);
          return EMPTY;
        })
      ).subscribe( user => {
        this.user = user;
        this.profile.user = user;
        resolve(user);
      });

    });

    const RepoPromise = new Promise((resolve,reject) => {

    /*   if(this.user?.public_repos != 0){
        reject(null);
      } */

      this.githubService.getUserRepos(this.username)
        .pipe(
          catchError( err => {
            console.log(err);
            
            this.repos = null;
            this.error = err;
            this.handleError(err);
            return EMPTY;
          })
        ).subscribe( repos => {
          console.log(repos);

          repos.forEach(repo =>{
            console.log(repo);
            this.profile.repos.push(repo)
          })

          resolve(repos);
        });

    })
    
    Userpromise.then((user)=> {
      
      console.log('User found succesfully:',user);
      RepoPromise.then((repo)=> {
        console.log('Repos found succesfully');
      })
      .catch((err)=> {
        console.log("Error fetching repos: ", err);
      })
    })
    .catch((err)=> {
      console.log("User not found: ", err);
    })
 

  }

  handleError(err){

    switch(err){
      case 404 :
        this.errorMessage = "Usuario no encontrado";
        break;
      case 403 : 
        this.errorMessage = "límite de peticiones";
        break;
      default :
        this.errorMessage = "error desconocido";
        break;
    }

  }

}
