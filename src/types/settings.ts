// Community Settings Types

export interface GeneralSettings {
  allowMemberInvitations: boolean;
  requireApproval: boolean;
  allowProfileCustomization: boolean;
  showMemberDirectory: boolean;
  enableComments: boolean;
  moderatePosts: boolean;
  allowFileUploads: boolean;
  defaultPostVisibility: "PUBLIC" | "MEMBERS_ONLY" | "ADMINS_ONLY";
  communityGuidelines: string;
  requireGuidelinesAcceptance: boolean;
}

export interface FeatureSettings {
  events: boolean;
  courses: boolean;
  challenges: boolean;
  leaderboards: boolean;
  resourcesLibrary: boolean;
  directMessaging: boolean;
  paidMemberships: boolean;
  premiumContent: boolean;
  donations: boolean;
  achievementBadges: boolean;
  pointsSystem: boolean;
  memberLevels: boolean;
}

export interface BrandingSettings {
  primaryColor: string;
  logo?: File | null;
  coverImage?: File | null;
  favicon?: File | null;
  headingFont: string;
  bodyFont: string;
  customCss: string;
  enableCustomCss: boolean;
}

export interface NotificationSettings {
  welcomeEmail: boolean;
  weeklyDigest: boolean;
  newContentNotifications: boolean;
  commentNotifications: boolean;
  eventReminders: boolean;
  pushNotifications: boolean;
  newMemberAlerts: boolean;
  flaggedContentAlerts: boolean;
  paymentNotifications: boolean;
}

export interface PrivacySecuritySettings {
  communityVisibility: "PUBLIC" | "PRIVATE" | "SECRET";
  allowSearchIndexing: boolean;
  showMemberListToNonMembers: boolean;
  requireEmailVerification: boolean;
  twoFactorAuth: boolean;
  autoBanSpam: boolean;
}

export interface CommunitySettings {
  general: GeneralSettings;
  features: FeatureSettings;
  branding: BrandingSettings;
  notifications: NotificationSettings;
  privacySecurity: PrivacySecuritySettings;
}

// Default settings values
export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  allowMemberInvitations: true,
  requireApproval: false,
  allowProfileCustomization: true,
  showMemberDirectory: true,
  enableComments: true,
  moderatePosts: false,
  allowFileUploads: true,
  defaultPostVisibility: "PUBLIC",
  communityGuidelines: "",
  requireGuidelinesAcceptance: false,
};

export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  events: true,
  courses: false,
  challenges: true,
  leaderboards: false,
  resourcesLibrary: true,
  directMessaging: true,
  paidMemberships: false,
  premiumContent: false,
  donations: false,
  achievementBadges: false,
  pointsSystem: false,
  memberLevels: false,
};

export const DEFAULT_BRANDING_SETTINGS: BrandingSettings = {
  primaryColor: "#6366f1",
  logo: null,
  coverImage: null,
  favicon: null,
  headingFont: "system",
  bodyFont: "system",
  customCss: "",
  enableCustomCss: false,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  welcomeEmail: true,
  weeklyDigest: false,
  newContentNotifications: true,
  commentNotifications: true,
  eventReminders: true,
  pushNotifications: false,
  newMemberAlerts: true,
  flaggedContentAlerts: true,
  paymentNotifications: true,
};

export const DEFAULT_PRIVACY_SECURITY_SETTINGS: PrivacySecuritySettings = {
  communityVisibility: "PUBLIC",
  allowSearchIndexing: true,
  showMemberListToNonMembers: false,
  requireEmailVerification: true,
  twoFactorAuth: false,
  autoBanSpam: true,
};

export const DEFAULT_COMMUNITY_SETTINGS: CommunitySettings = {
  general: DEFAULT_GENERAL_SETTINGS,
  features: DEFAULT_FEATURE_SETTINGS,
  branding: DEFAULT_BRANDING_SETTINGS,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  privacySecurity: DEFAULT_PRIVACY_SECURITY_SETTINGS,
};
