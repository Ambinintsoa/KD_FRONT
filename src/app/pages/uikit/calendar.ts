import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule,],
  template:` <full-calendar [options]="calendarOptions"></full-calendar>`,
})
export class CalendarComponent {
    calendarOptions: CalendarOptions = {
      initialView: 'dayGridMonth',
      selectable: true,
      editable: true,
      plugins: [dayGridPlugin, interactionPlugin], // ✅ Ajout des plugins
      events: [
        { title: 'Réunion équipe', date: '2024-03-20' },
        { title: 'Démo projet', date: '2024-03-22' }
      ],
      dateClick: (info) => this.handleDateClick(info) // ✅ Corrige la gestion du clic
    };
  
    handleDateClick(info: any) {
      alert('Date sélectionnée : ' + info.dateStr);
    }
  }
