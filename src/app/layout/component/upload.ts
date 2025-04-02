import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
 template:`<div>
 <h2>Upload Excel</h2>
 <input type="file" (change)="onFileSelected($event)" accept=".xlsx, .xls" />
 <button (click)="uploadFile()">Uploader</button>
 <p>{{ message }}</p>
 <ul *ngIf="errorMessages.length > 0">
   <li *ngFor="let error of errorMessages" style="color: red;">{{ error }}</li>
 </ul>

 <h2>Export Excel</h2>
 <button (click)="exportToExcel()">Exporter les produits</button>
</div>`
})
export class UploadComponent {
  selectedFile: File | null = null;
  message: string = '';
  errorMessages: string[] = []; // Ajout pour stocker les erreurs multiples

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    this.errorMessages = []; // Réinitialiser les erreurs
    if (!this.selectedFile) {
      this.message = 'Veuillez sélectionner un fichier';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:3000/api/upload', formData).subscribe({
      next: (response: any) => {
        this.message = response.message;
      },
      error: (err) => {
        if (err.error.errors && Array.isArray(err.error.errors)) {
          this.errorMessages = err.error.errors; // Afficher toutes les erreurs
        } else {
          this.message = err.error.error || 'Erreur lors de l\'upload';
        }
      }
    });
  }

  exportToExcel(): void {
    this.http.get('http://localhost:3000/api/upload/export', { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'produits.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.message = 'Exportation réussie !';
      },
      error: (err) => {
        this.message = 'Erreur lors de l\'exportation : ' + err.message;
      }
    });
  }
}