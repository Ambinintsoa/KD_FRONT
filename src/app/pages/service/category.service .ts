import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



export interface CategoryObject {
    id?: string;
    nom_categorie?: string;
}

@Injectable()
export class CategoryService {
    getProductsData() {
        return [
            {
                id: '1000',
                nom_categorie: 'Vidange d #&aps huile et remplacement du filtre',
            },
            {
                id: '1001',
                nom_categorie: 'Contrôle et remplacement des liquides (refroidissement, frein, direction assistée)',
            },
        ];
    }
    getProducts() {
        return Promise.resolve(this.getProductsData());
    }
}
