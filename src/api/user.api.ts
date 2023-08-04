import { User } from 'src/types/user.types';
import { SuccessResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

interface BodyUpdateProfile extends Omit<User, 'email' | '_id' | 'roles' | 'createAt' | 'updateAt'> {
  password: string;
  newPassword: string;
}

const userApi = {
  getProfile() {
    return http.get<SuccessResponse<User>>('me');
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.post('user', body);
  },
  uploadAvatar(body: FormData) {
    http.post<string>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default userApi;
