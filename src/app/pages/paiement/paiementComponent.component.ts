// app.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaiementService } from '../service/paiement.service';
@Component({
  selector: 'paiementComponent',
  templateUrl: './paiement.html',
  imports: [
    ReactiveFormsModule, CommonModule
  ]
})
export class PaiementComponent {
  form!: FormGroup;
  @Output() paiementForm_attr = new EventEmitter<boolean>();
  @Input() idfacture?: string = '';

  constructor(private fb: FormBuilder, private paiement_service: PaiementService) {
    this.init();
  }
  
  init() {
    this.form = this.fb.group({
      montant_payer: [null, [Validators.required, Validators.min(0)]],
      facture: [''], // Default value
      date: [this.getTodayDate(), Validators.required],
      time: [this.getCurrentTime(), Validators.required],
      date_heure: ['']
    });
  }

  ngOnInit(): void {
    // Update the form with the idfacture once it's available
    this.form.patchValue({ facture: this.idfacture });
    console.log(this.idfacture, 'idfacture');
  }
  getCurrentTime() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Format HH:mm
    return currentTime; // Définir la valeur initiale
  }
  // Fonction pour récupérer la date du jour au format yyyy-MM-dd (compatible input type="date")
  getTodayDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulaire soumis :', this.form.value);
      this.form.value.date_heure = this.form.value.date + "T" + this.form.value.time;
      // alert(`Montant : ${this.form.value.montant_payer}\nDate : ${this.form.value.date} \n Dateheure:${this.form.value.date_heure}`);

      this.paiement_service.savePaiement(this.form.value).subscribe({
        next: (result) => {
          alert('Paiement enregistré avec succès');
          this.init();
        },
        error: (err) => {
          console.error('Erreur lors de l’enregistrement du paiement :', err);
        },
      });
      this.paiementForm_attr.emit(false);
    } else {
      alert('Veuillez remplir correctement le formulaire.');
    }
  }
}
