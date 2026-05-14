import { ProfileForm } from "@/components/profile/ProfileForm";
import Wrapper from "@/components/shared/Wrapper";
export default function ProfilePage() {
  return (
    <Wrapper>
      <div className="flex w-full flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Thông tin cá nhân
        </h1>
        <p className="mt-1 text-slate-500">
          Quản lý thông tin tài khoản và thiết lập hồ sơ của bạn.
        </p>
      </div>
      <ProfileForm />
    </Wrapper>
  );
}
