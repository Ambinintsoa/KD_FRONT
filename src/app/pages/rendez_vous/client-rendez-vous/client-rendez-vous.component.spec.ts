import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRendezVousComponent } from './client-rendez-vous.component';

describe('ClientRendezVousComponent', () => {
  let component: ClientRendezVousComponent;
  let fixture: ComponentFixture<ClientRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientRendezVousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
