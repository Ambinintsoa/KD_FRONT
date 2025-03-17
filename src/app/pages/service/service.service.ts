import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryObject } from './category.service ';



export interface ServiceObject {
    id?: string;
    nom_service?: string;
    duree?: number;
    prix?: number;
    categorie?:CategoryObject;


}

@Injectable()
export class ServiceService {
    getProductsData() {
        return [
            {
                id: '1000',
                nom_service: 'Vidange d #&aps huile et remplacement du filtre',
                duree:2,
                prix:5,
                categorie:{
                    id:'1',
                    nom_categorie:"aaaaa",
                }
            },
            {
                id: '1001',
                nom_service: 'Contrôle et remplacement des liquides (refroidissement, frein, direction assistée)',
                duree:2,
                prix:5,
                categorie:{
                    id:'1',
                    nom_categorie:"aaaaa",
                }
            },
        ];
    }
    getProducts() {
        return Promise.resolve(this.getProductsData());
    }
}
