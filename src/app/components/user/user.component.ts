import { Component, Input, OnInit } from '@angular/core';
import { Repo } from 'src/app/models/repo.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  error = false;
  @Input() profile = null;
  user : User;
  repos: Repo;

  constructor() { 
    
    
    
  }

  ngOnInit(){
    console.log(this.profile);
    
    if(this.profile != null){
      this.user = this.profile?.user;
      this.repos = this.profile?.repos;
      console.log('repos: ',this.profile.repos);
 
      console.log(this.repos);
      
    }
  }

}
