import { User } from '../shared/models/user.model';

interface AmplitudeEvent {
  name: string;
  data?: Object;
}

declare let window: any;

export class AmplitudeService {
  waitingToBeReady: AmplitudeEvent[] = [];

  constructor() {
    this.watchToBeReady();
  }

  watchToBeReady() {
    const interval = setInterval(() => {
      if (AmplitudeService.isReady()) {
        clearInterval(interval);
        this.waitingToBeReady.forEach((event) => {
          this.track(event.name, event.data);
        });
        return;
      }
    }, 1000);
  }

  static isReady() {
    return !!window.amplitude;
  }

  setUser(user: User) {
    const interval = setInterval(() => {
      if (!window.amplitude) {
        return;
      }
      clearInterval(interval);
      if (!user) {
        return;
      }
      window.amplitude.setUserId(user.id);
      window.amplitude.setUserProperties({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_social_user: user.is_social_user,
        is_staff: user.is_staff,
        is_store_seller: user.is_store_seller,
        delivery_employee_id: user.delivery_employee_id,
      });
    }, 1000);
  }

  track(name: string, data?: Object) {
    if (!AmplitudeService.isReady()) {
      this.waitingToBeReady.push({name, data});
      return;
    }
    window.amplitude.getInstance().logEvent(name, data);
  }
}
