import type { RuntimeSnapshot } from "@/lib/runtime/types"

export type AppShellVariant = "mobile" | "desktop"

export function resolveShellVariant(snapshot: Pick<RuntimeSnapshot, "platform" | "isDesktopViewport">): AppShellVariant {
  if (snapshot.platform === "wecom") {
    return "mobile"
  }

  return snapshot.platform === "web" && snapshot.isDesktopViewport ? "desktop" : "mobile"
}
