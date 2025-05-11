import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentRequest, RestockRequest } from '../service/notification.service';

@Component({
    selector: 'app-comment-notifications',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="fixed bottom-4 right-4 z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-full">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    Notifications
                </h3>
                <div class="space-y-3 max-h-64 overflow-y-auto">
                    <div *ngFor="let notif of requests" 
                         class="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                         <strong>Nouveau commentaire</strong>
                        </p>
                    </div>
                    <p *ngIf="requests.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                        Aucune nouvelle notification
                    </p>
                </div>
            </div>
        </div>
    `
})
export class CommentNotificationsComponent {
    @Input() requests: CommentRequest[] = [];
}