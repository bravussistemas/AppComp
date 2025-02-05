import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';

interface EventData {
  [eventName: string]: Subject<any>;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: EventData = {};

  /**
   * Emit an event with a specific name and optional data.
   * @param eventName The name of the event to emit.
   * @param data Optional data to pass with the event.
   */
  emitEvent(eventName: string, data?: any): void {
    if (!this.events[eventName]) {
      this.events[eventName] = new Subject<any>();
    }
    this.events[eventName].next(data);
  }

  /**
   * Subscribe to an event with a specific name.
   * @param eventName The name of the event to subscribe to.
   * @returns An Observable to subscribe to.
   */
  onEvent(eventName: string): Observable<any> {
    if (!this.events[eventName]) {
      this.events[eventName] = new Subject<any>();
    }
    return this.events[eventName].asObservable();
  }

  /**
   * Unsubscribe from a specific event.
   * @param eventName The name of the event to unsubscribe from.
   */
  unsubscribe(eventName: string): void {
    if (this.events[eventName]) {
      this.events[eventName].complete(); // Marca o Subject como concluído
      delete this.events[eventName]; // Remove o evento do registro
    }
  }

  /**
   * Remove all events (useful for cleanup in some scenarios).
   */
  clearAllEvents(): void {
    Object.keys(this.events).forEach(eventName => this.unsubscribe(eventName));
  }
}
