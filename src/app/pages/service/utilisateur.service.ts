
import { Injectable } from '@angular/core';



export interface UtilisateurObject {
    id?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    adresse?: string;
    contact?: string;
    poste?: string;
    genre?: string;
    date_de_naissance?: string;


}


@Injectable()
export class UtilisateurService {
    getProductsData() {
        return [
            {
                id: '1000',
                nom: 'Vidange d #&aps huile et remplacement du filtre',
                prenom: 'Vidange d #&aps huile et remplacement du filtre',
                email: 'aa@gmail.com',
                adresse: 'Antananarivo',
                contact: '034 40 056 67',
                poste: 'Manager',
                genre: 'Femme',
                date_de_naissance: '08-09-2024',
            },
            {
                id: '1000',
                nom: 'Vidange d #&aps huile et remplacement du filtre',
                prenom: 'Vidange d #&aps huile et remplacement du filtre',
                email: 'aa@gmail.com',
                adresse: 'Antananarivo',
                contact: '034 40 056 67',
                poste: 'Manager',
                genre: 'Femme',
                date_de_naissance: '08-09-2024',
            },
        ];
    }
    getProducts() {
        return Promise.resolve(this.getProductsData());
    }
}
