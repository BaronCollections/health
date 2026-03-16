export type PageStateTone = "loading" | "empty" | "error"
export type FallbackBadgeTone = "info" | "warning"

export function getPageStateMeta(tone: PageStateTone) {
  switch (tone) {
    case "loading":
      return {
        icon: "loader" as const,
        wrapperClassName: "border-[#DDECDC] bg-white/90",
        iconClassName: "bg-[#EFF8F0] text-primary",
      }
    case "error":
      return {
        icon: "alert" as const,
        wrapperClassName: "border-[#F2D6D6] bg-white/95",
        iconClassName: "bg-[#FFF1F0] text-[#B42318]",
      }
    default:
      return {
        icon: "inbox" as const,
        wrapperClassName: "border-[#DDECDC] bg-white/90",
        iconClassName: "bg-[#F4FAF5] text-primary",
      }
  }
}

export function getFallbackBadgeMeta(tone: FallbackBadgeTone) {
  if (tone === "warning") {
    return {
      wrapperClassName: "bg-[#FFF7E6] text-[#B54708]",
      dotClassName: "bg-[#B54708]",
    }
  }

  return {
    wrapperClassName: "bg-[#EFF8F0] text-primary",
    dotClassName: "bg-primary",
  }
}
