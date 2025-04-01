import { TestBed } from '@angular/core/testing';

import { CategorievoitureService } from './categorievoiture.service';

describe('CategorievoitureService', () => {
  let service: CategorievoitureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorievoitureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
