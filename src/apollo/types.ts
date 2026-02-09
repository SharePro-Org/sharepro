export interface Campaign {
  name: string;
  campaignId: string;
  campaignName: string;
  campaignType: string;
  dateJoined: string;
  campaignReferralLink: string;
  referralCode: string;
  rewardInfo: string;
  status: string;
  totalReferrals: number;
  totalRewards: number;
  endDate: string;
  isJoinable: boolean;
  participantsCount: number;
  maxParticipants: number;
  description: string;
  id?: string;
  campaign?: {
    id: string;
    name: string;
    campaignType: string;
    status: string;
    endDate: string;
    maxParticipants: number;
    participantsCount: number;
    referralLink: string;
    websiteLink: string;
    totalReferrals: number;
    totalRewardsGiven: number;
  };
}

export interface Reward {
  amount: number;
  points: number;
  campaignName: string;
  createdAt: string;
  currency: string;
  description: string;
  isClaimable: boolean;
  processedAt: string | null;
  rewardId: string;
  rewardType: string;
  status: string;
}

export interface Plan {
  name: string;
  price: string;
  per: string;
  features: string[];
  planType: string;
  type: string;
  recommended?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  order: number;
  isFeatured: boolean;
  helpfulCount: number;
  viewCount: number;
  createdAt: string;
}

export interface WalkthroughVideo {
  id: string;
  name: string;
  description: string;
  category: string;
  fileUrl: string;
  thumbnailUrl: string;
  duration: number;
  order: number;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
}

export interface ReferralUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ProofFile {
  id: string;
  file: string;
  fileUrl?: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface ReferralReward {
  id: string;
  status: string;
  proofSubmittedAt?: string;
  proofDescription?: string;
  proofFiles: ProofFile[];
}

export interface CampaignReferral {
  id: string;
  referralCode: string;
  status: 'pending' | 'clicked' | 'registered' | 'converted' | 'rejected' | 'expired';
  createdAt: string;
  clickedAt?: string;
  registeredAt?: string;
  convertedAt?: string;
  purchaseAmount?: number;
  commissionAmount?: number;
  commissionPercentage?: number;
  referrer: ReferralUser;
  referee?: ReferralUser;
  refereeEmail?: string;
  refereeName?: string;
  refereePhone?: string;
  rewards?: ReferralReward[];
}

export interface CampaignReferralsResponse {
  campaignReferrals: CampaignReferral[];
}

export interface AggregatedReferrer {
  referrer: ReferralUser;
  totalReferrals: number;
  conversions: number;
  totalCommission: number;
  firstReferralDate: string;
  referrals: CampaignReferral[];
}