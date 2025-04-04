import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminNotificationsComponent } from "../../pages/crud/AdminNotificationsComponent";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService, RestockRequest } from '../../pages/service/notification.service';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
            m1p12mean-Fy-Isabelle
            <a href="https://primeng.org" target="_blank" rel="noopener noreferrer" 
               class="text-primary font-bold hover:underline">
                RANAIVOZAFY Fy Andrianina - RANDRIAMBOLOLONA Ambinintsoa Isabelle
            </a>
        </div>
        <app-admin-notifications 
            *ngIf="authService.getCurrentUser()()?.role === 'admin'"
            [requests]="requests">
        </app-admin-notifications>
    `,
    imports: [AdminNotificationsComponent, CommonModule]
})
export class AppFooter implements OnInit, OnDestroy {
    requests: RestockRequest[] = [];
    private subscription: Subscription | undefined;
    private timeouts: { [key: string]: NodeJS.Timeout } = {};

    constructor(
        public authService: AuthService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.notificationService.connect();
        this.subscription = this.notificationService.onNewRestockRequest().subscribe(
            (request: RestockRequest) => {
                this.requests = [request, ...this.requests];

                const timeoutId = setTimeout(() => {
                    this.removeNotification(request._id);
                }, 8000); 

                this.timeouts[request._id] = timeoutId;
            },
            (error) => {
                console.error('Erreur dans la souscription:', error);
            }
        );
    }

    private removeNotification(id: string): void {
        this.requests = this.requests.filter(request => request._id !== id);
        if (this.timeouts[id]) {
            clearTimeout(this.timeouts[id]);
            delete this.timeouts[id];
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        Object.keys(this.timeouts).forEach(id => {
            clearTimeout(this.timeouts[id]);
            delete this.timeouts[id];
        });
        this.notificationService.disconnect();
    }
}