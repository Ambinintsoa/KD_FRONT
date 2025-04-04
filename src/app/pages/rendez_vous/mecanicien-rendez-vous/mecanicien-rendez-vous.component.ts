import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { RendezVousService } from '../../service/rendez-vous-service.service';
@Component({
  selector: 'app-mecanicien-rendez-vous',
  imports: [FullCalendarModule],
  template: '<full-calendar [options]="calendarOptions"></full-calendar>',
  styleUrl: './mecanicien-rendez-vous.component.scss'
})
export class MecanicienRendezVousComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    // initialView: 'dayGridMonth',
    initialView: 'timeGridWeek',
    locale: frLocale,
    selectable: true,
    editable: true,
    plugins: [dayGridPlugin, interactionPlugin,timeGridPlugin],
    events: [],  // Initialement vide
    dateClick: (info: any) => this.handleDateClick(info)
  };

  date_filtre: string = '';

  constructor(private rendezvousService: RendezVousService) { } // Injection du service

  ngOnInit(): void {
    console.log("Tokony rendez-vous...");
    this.loadEvents();  // Charger les événements lors de l'initialisation
  }

  loadEvents() {
   
    this.rendezvousService.getRendezVousMecanicien().subscribe(
      (data) => {  
      
        const rdv: any[] = [];
        
        for (const element of data.rendezvous) {
          const event = element;
          rdv.push({
            title: `Rendez-vous avec ${event.client.nom}`,
            date: new Date(event.date_heure_debut),
            start: new Date(event.date_heure_debut),
            end: new Date(event.date_heure_fin),
            statut: event.statut,
            montant_total: event.montant_total
          });
        }

        // Mettre à jour les événements avec les données de l'API
        this.calendarOptions = {
          ...this.calendarOptions,
          events: rdv // Les événements récupérés de l'API,
        };
      },
      (error) => {
        console.error('Erreur de récupération des rendez-vous', error);
      }
    );
  }

  handleDateClick(info: any) {
    alert('Date sélectionnée : ' + info.dateStr);
  }
}

// Définir une interface pour les événements
interface Event {
  client: {
    nom: string;
  };
  date_heure_debut: string; // ou Date si c'est déjà un objet Date
  date_heure_fin: string;   // ou Date
  statut: string;
  montant_total: number;
}
