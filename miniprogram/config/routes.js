export const TAB_BAR_ROUTES = Object.freeze([
  '/pages/home/index/index',
  '/pages/report/index/index',
  '/pages/checkin/index/index',
  '/pages/community/index/index',
  '/pages/profile/index/index',
]);

export const AUTH_ROUTES = Object.freeze({
  login: '/pages/auth/login/index',
  bindPhone: '/pages/auth/bind-phone/index',
});

export const ASSESSMENT_ROUTES = Object.freeze({
  questionnaire: '/pages/assessment/questionnaire/index',
  resultLoading: '/pages/assessment/result-loading/index',
});

export const REPORT_ROUTES = Object.freeze({
  index: '/pages/report/index/index',
  ocrUpload: '/pages/report/ocr-upload/index',
  ocrConfirmation: '/pages/report/ocr-confirmation/index',
  timeline: '/pages/report/timeline/index',
});

export const COMMUNITY_ROUTES = Object.freeze({
  index: '/pages/community/index/index',
  create: '/pages/community/create/index',
  detail: '/pages/community/detail/index',
  myPosts: '/pages/community/my-posts/index',
  review: '/pages/community/review/index',
});

export const PROFILE_ROUTES = Object.freeze({
  index: '/pages/profile/index/index',
  notifications: '/pages/profile/notifications/index',
  notificationDetail: '/pages/profile/notifications/detail/index',
  help: '/pages/profile/help/index',
  feedback: '/pages/profile/help/feedback/index',
  feedbackRecords: '/pages/profile/help/records/index',
  privacy: '/pages/profile/privacy/index',
  export: '/pages/profile/privacy/export/index',
  deleteRequest: '/pages/profile/privacy/delete-request/index',
  security: '/pages/profile/security/index',
  auditLog: '/pages/profile/audit-log/index',
  adminReleaseChecklist: '/pages/profile/admin/release-checklist/index',
});
