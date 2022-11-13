import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repo } from '../models/repo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubAPIService {

  constructor(private http: HttpClient) { }

  getUser(name: string) : Observable<User>{
    const url = `https://api.github.com/users/${name}`;
    return this.http.get<User>(url);
  }

  getUserRepos(name: string) : Observable<Repo[]>{ 
    const url = `https://api.github.com/users/${name}/repos`;
    const gitkey = environment.gitKey;
    const headerDict = {
      'Content-Type' : 'application/json; charset=utf-8',
      'Accept'       : 'application/json',
      'Authorization': `token ${gitkey}`
      }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    //Intentando pasar del límite de peticiones con una llamada autorizada
    return this.http.get<Repo[]>(url);
  }

}
