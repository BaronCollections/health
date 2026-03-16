export type CommunityAudience = "public" | "author" | "ops"

export type CommunityPostStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "flagged"
  | "hidden"

export type CommunityCommentStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "hidden"

export type CommunityStatus = CommunityPostStatus | CommunityCommentStatus

export type ModerationTargetType = "post" | "comment"

export type CommunityCircle = {
  id: string
  name: string
  description: string
  members: number
  accent: string
}

export type CommunityComment = {
  id: string
  authorName: string
  authorAvatar: string
  authorRole: string
  viewerOwned: boolean
  status: CommunityCommentStatus
  relativeTime: string
  content: string
  likes: number
  moderationReason?: string
}

export type CommunityPost = {
  id: string
  authorName: string
  authorAvatar: string
  authorRole: string
  viewerOwned: boolean
  circleId: string
  circleName: string
  status: CommunityPostStatus
  relativeTime: string
  content: string
  tags: string[]
  images: string[]
  likes: number
  saves: number
  comments: CommunityComment[]
  moderationReason?: string
}

export type ModerationQueueItem = {
  id: string
  targetId: string
  targetType: ModerationTargetType
  authorName: string
  authorAvatar: string
  circleName: string
  currentStatus: CommunityStatus
  relativeTime: string
  contentPreview: string
  moderationReason: string
}

export type CommunityContent = {
  home: {
    title: string
    subtitle: string
    recommendedTab: string
    circlesTab: string
    allCircles: string
    createCta: string
    myPostsCta: string
    emptyTitle: string
    emptyBody: string
    timelineBridge: {
      eyebrow: string
      title: string
      body: string
      cta: string
    }
  }
  create: {
    title: string
    subtitle: string
    circleLabel: string
    contentLabel: string
    contentPlaceholder: string
    tagsLabel: string
    addImage: string
    imageHint: string
    submit: string
    successTitle: string
    successBody: string
    pendingHint: string
  }
  detail: {
    backCta: string
    commentsTitle: string
    commentPlaceholder: string
    submitComment: string
    noComments: string
    like: string
    save: string
  }
  myPosts: {
    title: string
    subtitle: string
    tabs: Record<"pending_review" | "approved" | "rejected" | "flagged", string>
    emptyTitle: string
    emptyBody: string
    resubmit: string
  }
  review: {
    title: string
    subtitle: string
    tabs: Record<"pending_review" | "approved" | "rejected" | "flagged", string>
    targetPost: string
    targetComment: string
    queueEmptyTitle: string
    queueEmptyBody: string
    actions: {
      approve: string
      reject: string
      flag: string
      restore: string
    }
  }
  statuses: Record<CommunityStatus, string>
  circles: CommunityCircle[]
  seedPosts: CommunityPost[]
  reviewQueue: ModerationQueueItem[]
}
