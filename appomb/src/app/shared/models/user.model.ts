import { IUserProfile } from '../interfaces';
import { IFacebookUserData, IGoogleUserData, IJWTUser } from '../../providers/auth-service';

export class UserProfile implements IUserProfile {
  id: number;
  user_photo: string;
  profile_photo: string;
  user_photo_social: string;
  mobile_phone: string;
  mobile_phone_area: string;
  user_has_credit_card: boolean;
}

export class User {
  email: string;
  first_name: string;
  full_name: string;
  id: number;
  social_id: number;
  last_name: string;
  profile: IUserProfile;
  username: string;
  is_social_user: boolean;
  is_staff: boolean;
  is_store_seller: boolean;
  delivery_employee_id: number;
  stores_seller_ids: number[];
  stores_seller_ids_can_admin_app: number[];

  constructor() {
    this.profile = new UserProfile();
  }
}

export class UserProvider {

  constructor() {
  }

  static fromServer(data: IJWTUser): User {
    if (!data) {
      return null;
    }
    let user = new User();
    user.id = data.id;
    user.first_name = data.first_name;
    user.last_name = data.last_name;
    user.full_name = `${data.first_name} ${data.last_name}`;
    user.is_social_user = data.is_social_user;
    user.is_store_seller = data.is_store_seller;
    user.delivery_employee_id = data.delivery_employee_id;
    user.stores_seller_ids = data.stores_seller_ids;
    user.stores_seller_ids_can_admin_app = data.stores_seller_ids_can_admin_app;
    user.email = data.email;
    user.is_staff = data.is_staff;
    if (data.profile) {
        user.profile = data.profile;
      if (data.profile.user_photo) {
        user.profile.profile_photo = data.profile.user_photo;
      }
    }
    return user;
  }

  static fromGoogle(data: IGoogleUserData): User {
    if (!data) {
      return null;
    }
    let user = new User();
    if (data.displayName) {
      let nameParts = data.displayName.split(' ');
      if (nameParts.length >= 1) {
        user.first_name = nameParts[0];
      }
      user.full_name = data.displayName;
    }
    user.is_social_user = true;
    user.is_staff = false;
    user.email = data.email;
    user.social_id = data.userId;
    user.profile.user_photo = data.imageUrl;
    user.profile.profile_photo = data.imageUrl;
    return user;
  }

  static fromFacebook(data: IFacebookUserData) {
    if (!data) {
      return null;
    }
    let user = new User();
    if (data.name) {
      let nameParts = data.name.split(' ');
      if (nameParts.length >= 1) {
        user.first_name = nameParts[0];
      }
      user.full_name = data.name;
    }
    user.is_social_user = true;
    user.is_staff = false;
    user.email = data.email;
    // user.social_id = data.userId;

    if (data.picture && data.picture.data) {
      user.profile.user_photo = data.picture.data.url;
      user.profile.profile_photo = data.picture.data.url;
    }
    return user;
  }

}
