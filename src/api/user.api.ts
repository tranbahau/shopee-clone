import { User } from 'src/types/user.types';
import { SuccessResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

type BodyUpdateProfile = Omit<User, 'email' | '_id' | 'roles' | 'createdAt' | 'updatedAt'>;

const userApi = {
  getProfile() {
    return http.get<SuccessResponse<User>>('me');
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<User>>('user', body);
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponse<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default userApi;
