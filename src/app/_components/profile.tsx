"use client";
import Image from "next/image";
import { UserType } from "../_features/user/userSlice";
type ProfileProps = {
  user: UserType
};

export default function Profile({ user }: ProfileProps) {
  return (
    <>
      <div className="rounded-full transition-all ease-in-out duration-300 ">
        <Image width={20} height={20} src={user.imageUrl!} alt={user.name} />
      </div>
    </>
  );
}
