"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { authClient } from "@/lib/auth-client";
import { IconChevronUp, IconLogout, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface UserInfo {
  id: string;
  name: string;
  image?: string | null | undefined;
  email: string;
}

export default function UserProfile({ mini }: { mini?: boolean }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const result = await authClient.getSession();
      if (!result.data?.user) return;
      setUserInfo(result.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={
            mini
              ? "flex items-center"
              : "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-secondary/60 transition-colors text-left"
          }
        >
          <InitialsAvatar
            name={userInfo?.name || "?"}
            size={mini ? "sm" : "sm"}
          />
          {!mini && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {userInfo?.name || "Loading…"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {userInfo?.email}
              </div>
            </div>
          )}
          {!mini && (
            <IconChevronUp className="size-4 text-muted-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard/settings">
          <DropdownMenuItem className="cursor-pointer">
            <IconSettings className="size-4" />
            Studio settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <IconLogout className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
