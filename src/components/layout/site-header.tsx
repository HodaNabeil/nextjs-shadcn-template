"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogIn, LogOut, Menu, ShoppingCart } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartItemCount } from "@/features/cart/hooks/use-cart-item-count";
import type { AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

type SiteHeaderProps = {
  user: AuthUser | null;
};

const navLinks = [
  { href: "/courses", label: "Courses", icon: BookOpen },
] as const;

function getUserInitials(user: AuthUser): string {
  if (user.name) {
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  if (user.email) {
    return user.email[0]?.toUpperCase() ?? "U";
  }

  return "U";
}

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  className,
}: {
  href: string;
  label: string;
  icon: typeof BookOpen;
  isActive: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn(
          "size-4 transition-colors duration-200",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      />
      {label}
    </Link>
  );
}

function CartButton({ isActive }: { isActive: boolean }) {
  const itemCount = useCartItemCount();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      render={<Link href="/cart" aria-label="Shopping cart" />}
      nativeButton={false}
    >
      <ShoppingCart
        className={cn(
          "size-5 transition-colors duration-200",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      />
      {itemCount > 0 ? (
        <Badge
          key={itemCount}
          className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px] font-semibold animate-in zoom-in-50 duration-200"
        >
          {itemCount > 9 ? "9+" : itemCount}
        </Badge>
      ) : null}
    </Button>
  );
}

function AuthSection({ user }: { user: AuthUser | null }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success("You have been signed out.");
    router.refresh();
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        render={<Link href="/login" />}
        nativeButton={false}
      >
        <LogIn />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Open user menu"
          />
        }
      >
        <Avatar size="sm">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name ?? "User avatar"} />
          ) : null}
          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            {user.name ? (
              <p className="text-sm font-medium text-foreground">{user.name}</p>
            ) : null}
            {user.email ? (
              <p className="text-xs text-muted-foreground">{user.email}</p>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => void handleSignOut()}
        >
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const isCartActive = pathname === "/cart";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link
            href="/"
            className="shrink-0 text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            LearnHub
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                isActive={pathname === link.href}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open navigation menu"
                  />
                }
              >
                <Menu className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.href}
                    render={<Link href={link.href} />}
                    className={cn(
                      pathname === link.href && "text-primary focus:text-primary",
                    )}
                  >
                    <link.icon
                      className={cn(
                        pathname === link.href
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    {link.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href="/cart" />}
                  className={cn(
                    isCartActive && "text-primary focus:text-primary",
                  )}
                >
                  <ShoppingCart
                    className={cn(
                      isCartActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  Cart
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CartButton isActive={isCartActive} />

          <AuthSection user={user} />
        </div>
      </div>
    </header>
  );
}
