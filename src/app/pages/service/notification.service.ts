import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

export interface RestockRequest {
    _id: string;
    productName: string;
    quantity: number;
    requestedBy: string;
    createdAt: string | Date;
}
export interface CommentRequest {
    _id: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private socket!: Socket;
    private isConnected = false;

    constructor(private authService: AuthService) {}

    connect(): void {
        if (this.isConnected) return;

        const token = this.authService.getToken();
        this.socket = io(environment.apiUrl, {
            withCredentials: true,
            auth: { token }
        });

        this.socket.on('connect', () => {
            this.isConnected = true;
        });

        this.socket.on('connect_error', (err) => {
            console.error('Erreur de connexion Socket.IO:', err.message);
            this.isConnected = false;
        });
    }

    onNewRestockRequest(): Observable<RestockRequest> {
        return new Observable(observer => {
            if (!this.isConnected) {
                this.connect();
            }

            this.socket.on('newRestockRequest', (data: RestockRequest) => {
                observer.next(data);
            });

            return () => {
                this.socket.off('newRestockRequest');
            };
        });
    }
    onNewComment(): Observable<CommentRequest> {
        return new Observable(observer => {
            if (!this.isConnected) {
                this.connect();
            }

            this.socket.on('newComment', (data: CommentRequest) => {
                observer.next(data);
            });

            return () => {
                this.socket.off('newComment');
            };
        });
    }
    disconnect(): void {
        if (this.socket && this.isConnected) {
            this.socket.disconnect();
            this.isConnected = false;
            console.log('Socket.IO déconnecté');
        }
    }
}