import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
  Crown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from 'react-router-dom';
import { useLogout, useUserState } from '../hooks/user';
import { useTranslation } from "react-i18next";  // добавляем хук перевода

import ROUTES from '../config/routes'


export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar()
  const navigate = useNavigate();
  const logout = useLogout();
  const { user: userData } = useUserState() || { user: { username: '', email: '' } };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const hasFullAccess = userData?.is_has_full_access === true

  const planConfig = hasFullAccess
    ? {
        label: "Pro",  // например, 'Профи'
        icon: Crown,
        variant: "default" as const,
        color: "text-amber-600",
        bgColor: "bg-amber-50 border-amber-200",
      }
    : {
        label: "Free",  // например, 'Бесплатно'
        icon: null,
        variant: "secondary" as const,
        color: "text-muted-foreground",
        bgColor: "bg-gray-50 border-gray-200",
      }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{userData?.email || t("nav.noEmail")}</span>
                  {hasFullAccess && planConfig.icon && <planConfig.icon className={`h-3 w-3 ${planConfig.color}`} />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs text-muted-foreground">{userData?.email || t("nav.noEmail")}</span>
                  <Badge
                    variant={planConfig.variant}
                    className={`h-4 px-1.5 text-xs ${hasFullAccess ? "bg-amber-100 text-amber-800 border-amber-300" : ""}`}
                  >
                    {planConfig.label}
                  </Badge>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">{userData?.email || t("nav.noEmail")}</span>
                    {hasFullAccess && planConfig.icon && <planConfig.icon className={`h-3 w-3 ${planConfig.color}`} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs text-muted-foreground">{userData?.email || t("nav.noEmail")}</span>
                    <Badge
                      variant={planConfig.variant}
                      className={`h-4 px-1.5 text-xs ${hasFullAccess ? "bg-amber-100 text-amber-800 border-amber-300" : ""}`}
                    >
                      {planConfig.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {!hasFullAccess && (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate(ROUTES.PAYMENT)}
                    className="cursor-pointer gap-2 text-blue-600"
                  >
                    <Sparkles className="h-4 w-4" />
                    {t("nav.upgradeToPro")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* {hasFullAccess && (
                <DropdownMenuItem className="gap-2">
                  <Crown className="h-4 w-4 text-amber-600" />
                  {t("nav.proFeatures")}
                </DropdownMenuItem>
              )} */}
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)} className="cursor-pointer">
                <BadgeCheck />
                {t("nav.account")}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell />
                {t("nav.notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut />
              {t("nav.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
