import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Subject } from "rxjs";
import { HistoriqueService } from '../service/historique-service.service';
import { ListParams } from '../service/Params';
@Component({
  selector: 'app-historique-service',
  templateUrl: './historique-service.component.html',
  // styleUrls: ['./historique-service.component.css'],
  imports: [TableModule,CommonModule]
})
export class HistoriqueServiceComponent implements OnInit {

  isLoading = true;
  historiqueServiceObjects = [];
  cols: any[] = [
    { field: 'nom_service', header: 'Nom Service' },
    { field: 'date_service', header: 'Date Service' },
    { field: 'statut_service', header: 'Statut du Service' }
  ];
  totalRecords = 0;
  limit = 10;
  first = 0;
  sortBy = '';
  orderBy = 'asc';
  search = '';  
  page = 1;
  selectedHistoriqueServices: any;
 private loadDataSubject = new Subject<ListParams>();

  constructor(private historiqueService: HistoriqueService) {
    // this.loadDataSubject
    //       .pipe(debounceTime(300), distinctUntilChanged())
    //       .subscribe((params) => {
    //         this.loadDemoData(
    //           params.page,
    //           params.limit,
    //           params.search,
    //           params.sortBy,
    //           params.orderBy
    //         );
    //       });
   }

  ngOnInit(): void {
    this.loadDataSubject.next({
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      orderBy: this.orderBy,
    });
    this.loadHistoriqueService(  this.page,
       this.limit,
       this.search,
       this.sortBy,
       this.orderBy);
  }

  loadHistoriqueService( page: number,
    limit: number,
    search: string,
    sortBy: string,
    orderBy: string) {
    this.isLoading = true;
    this.historiqueService.getHistoriqueByClient({ page,
      limit,
      search,
      sortBy,
      orderBy,}).subscribe({
      next: (data: any) => {
        this.historiqueServiceObjects = data.historique_service_objects;
        this.totalRecords = data.totalItems;
        this.isLoading = false;
      }
    });
    
    
  }

  onLazyLoad(event: any) {
    this.first = event.first;
    this.limit = event.rows;
      this.loadHistoriqueService(  this.page,
       this.limit,
       this.search,
       this.sortBy,
       this.orderBy);
  }

  onSortChange(event: any) {
    this.sortBy = event.sortField;
    this.orderBy = event.sortOrder === 1 ? 'asc' : 'desc';
      this.loadHistoriqueService(  this.page,
       this.limit,
       this.search,
       this.sortBy,
       this.orderBy);
  }
    onGlobalFilter(dt: any, event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.first = 0;
    // this.triggerLoadData();
  }

}