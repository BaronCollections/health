"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Calendar, Users, User } from "lucide-react"

export function SharedNav() {
  const pathname = usePathname()

  const tabs = [
    { href: "/", icon: Home, label: "首页" },
    { href: "/report", icon: FileText, label: "报告" },
    { href: "/checkin", icon: Calendar, label: "打卡" },
    { href: "/community", icon: Users, label: "社区" },
    { href: "/profile", icon: User, label: "我的" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-sm border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon
          
          return (
            <Link 
              key={tab.href} 
              href={tab.href} 
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive ? "bg-[#E8FFE8]" : "hover:bg-[#F5F5F5]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[10px] transition-colors ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
