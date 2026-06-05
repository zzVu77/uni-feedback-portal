import { ProfileForm } from "@/components/profile/ProfileForm";
import Wrapper from "@/components/shared/Wrapper";
export default function ProfilePage() {
  return (
    <Wrapper>
      <div className="flex h-full w-full flex-col gap-1">
        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Thông tin cá nhân
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Quản lý thông tin tài khoản và thiết lập hồ sơ của bạn.
            </p>
          </div>
        </div>
        <div className="flex-1">
          <ProfileForm />
        </div>
      </div>
    </Wrapper>
  );
}
