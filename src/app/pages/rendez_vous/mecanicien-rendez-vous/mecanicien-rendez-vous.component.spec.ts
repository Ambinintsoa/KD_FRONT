import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecanicienRendezVousComponent } from './mecanicien-rendez-vous.component';

describe('MecanicienRendezVousComponent', () => {
  let component: MecanicienRendezVousComponent;
  let fixture: ComponentFixture<MecanicienRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecanicienRendezVousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecanicienRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
