import { TestBed } from '@angular/core/testing';

import { GithubAPIService } from './github-api.service';

describe('GithubAPIService', () => {
  let service: GithubAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
