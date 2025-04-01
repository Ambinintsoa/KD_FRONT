import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryObject } from './category.service ';
import { ListParams } from './Params';


export interface ServiceObject {
    _id?: string;
    nom_service?: string;
    duree?:number,
    prix?:number,
    categorie?:any,
    checked?:boolean;
}
export interface ServiceResponse {
    services:ServiceObject[],
    currentPage:number,
    totalItems:number,
    totalPages:number
}
export interface ServiceCategoriesObject{
   categorie_objet:CategoryObject,
   service_objects:ServiceObject[]
};

@Injectable()
export class ServiceService {
    private apiUrl = `${environment.apiUrl}/service`
      constructor(private http: HttpClient) {}
    getServices(params:ListParams): Observable<ServiceResponse> {
           return this.http.get<ServiceResponse>(`${this.apiUrl}?page=${params.page}&limit=${params.limit}&search=${params.search}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`).pipe(
               tap(data => console.log("Données brutes reçues de l'API :", data)), // Vérification
               map(data => ({
                   services: data.services.map((item: any) => ({
                       _id: item._id,
                       nom_service: item.nom_service,
                       duree: item.duree,
                       prix:item.prix,
                      categorie : item.categorie_service
                   })),
                   currentPage: data.currentPage,
                   totalItems: data.totalItems,
                   totalPages: data.totalPages
               }))
           );
       }
     
      getServiceCategories(): Observable<ServiceCategoriesObject[]> {
        return this.http.get<{ resultat: any }>(`${this.apiUrl}/serviceCategorie`).pipe( tap(response=> console.log(response)),
            map((response) =>
                response.resultat.map((data:any) => ({
                    categorie_objet: {
                        _id: data.categorie_service._id,
                        nom_categorie: data.categorie_service.nom_categorie,
                    },
                    service_objects: data.service_object.map((service:any) => ({
                        _id: service._id,
                        nom_service: service.nom_service,
                        duree: service.duree,
                        prix: service.prix,
                        categorie: service.categorie_service,
                        checked: false, // Initialisation par défaut    
                    })),
                }))
            )
        );
    }
    
        
       
       
      createService(serviceObject: ServiceObject): Observable<any> {
          return this.http.post(`${this.apiUrl}/save`, {"nom_service":serviceObject.nom_service
            , "duree":serviceObject.duree,
            "prix": serviceObject.prix,
            "categorie_service":serviceObject.categorie._id
          });
      }
        updateService(serviceObject: ServiceObject): Observable<any> {
              return this.http.put(`${this.apiUrl}/update`,  {
                "_id":serviceObject._id,
                "nom_service":serviceObject.nom_service
                , "duree":serviceObject.duree,
                "prix": serviceObject.prix,
                "categorie_service":serviceObject.categorie._id
              });
          }
          deleteService(ids:string[]):Observable<any>{
            return this.http.delete(`${this.apiUrl}`, {
                body: ids
              });
          }
}
