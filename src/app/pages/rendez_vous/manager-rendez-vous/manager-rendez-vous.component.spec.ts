import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRendezVousComponent } from './manager-rendez-vous.component';

describe('ManagerRendezVousComponent', () => {
  let component: ManagerRendezVousComponent;
  let fixture: ComponentFixture<ManagerRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerRendezVousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
