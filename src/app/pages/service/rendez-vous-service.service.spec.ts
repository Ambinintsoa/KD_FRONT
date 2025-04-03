import { TestBed } from '@angular/core/testing';

import { RendezVousServiceService } from './rendez-vous-service.service';

describe('RendezVousServiceService', () => {
  let service: RendezVousServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RendezVousServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
