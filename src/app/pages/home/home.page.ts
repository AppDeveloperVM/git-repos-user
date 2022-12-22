import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, Subscription } from 'rxjs';

import { Profile } from '../../submodules/github-provider/models/profile.model';
import { Repo } from '../../submodules/github-provider/models/repo.model';
import { User } from '../../submodules/github-provider/models/user.model';
import { GithubAPIService } from '../../submodules/github-provider/services/github-api.service';
import { environment } from 'src/environments/environment';

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
  form : UntypedFormGroup;
  name : UntypedFormControl;
  isLoading = false;

  username : string;
  authkey  = environment.gitKey;

  constructor(private githubService : GithubAPIService) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl('')
    });

    this.init();

    this.profile = new Profile();
    this.profile.user = new User();
    this.profile.repos = new Array();
  }

  ngOnInit() {
  }

  init(){
    this.profile = new Profile();
    this.profile.user = new User();
    this.profile.repos = new Array();
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
    console.log("ON SEARCH");

    if(this.form.get('name').value != null){

      const username = this.form.get('name').value;
      console.log(username);

      this.user = null;
      this.repos = null;
      
      const Userpromise = new Promise((resolve,reject) => {

        this.githubService.getUser(username,this.authkey)
        .pipe(
          catchError( err => {
            console.log(err);
            
            this.user = null;
            this.error = err;

            this.handleError(err.status);

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

        this.githubService.getUserRepos(username,this.authkey)
          .pipe(
            catchError( err => {
              console.log(err);
              
              this.repos = null;
              this.error = err;
              this.handleError(err.status);
              reject(err);
              return EMPTY;
            })
          ).subscribe( repos => {
            repos.forEach(repo =>{
              this.profile.repos.push(repo)
            })
            resolve(repos);
          });

      })

      const finalpromise = new Promise((resolve,reject)=> {
        Userpromise.then((user)=> {
        
          console.log('User found succesfully:',user);
          RepoPromise.then((repo)=> {
            console.log('Repos found succesfully',repo);
            resolve(true);
          })
          .catch((err)=> {
            console.log("Error fetching repos: ", err);
            reject(false)
          })
        })
        .catch((err)=> {
          console.log("User not found: ", err);
          reject(false)
        })
      })

    }
 

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
