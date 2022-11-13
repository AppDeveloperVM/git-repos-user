import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Repo } from 'src/app/models/repo.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit,  OnChanges {
  error = false;
  @Input() profile = null;
  user : User;
  repos: Repo;

  constructor() { 
    
    
    
  }

  ngOnInit(){
    this.fetchProfileData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.profile) {
        // Do your logic here
        this.fetchProfileData()
    }
}

  fetchProfileData(){
    console.log(this.profile);
    
    if(this.profile != null){
      this.user = this.profile?.user;
      this.repos = this.profile?.repos;
      console.log('repos: ',this.profile.repos);
 
      console.log(this.repos);
      
    }
  }

}
