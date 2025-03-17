import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



export interface ProduitObject {
    id?: string;
    nom_produit?: string;
    unite?: string;
}

@Injectable()
export class ProduitService {
    getProductsData() {
        return [
            {
                id: '1000',
                nom_produit: 'Vidange d #&aps huile et remplacement du filtre',
                unite:"litre"
            },
            {
                id: '1001',
                nom_produit: 'Contrôle et remplacement des liquides (refroidissement, frein, direction assistée)',
                 unite:"litre"
            },
        ];
    }
    getProducts() {
        return Promise.resolve(this.getProductsData());
    }
}
