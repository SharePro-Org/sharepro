export interface Campaign {
  campaignId: string;
  campaignName: string;
  campaignType: string;
  dateJoined: string;
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
}

export interface Reward {
  amount: number;
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