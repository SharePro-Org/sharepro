import { gql } from '@apollo/client';
// Mutation to create a campaign
export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CampaignInput!) {
    createCampaign(input: $input) {
      success
      message
      errors
    }
  }
`;

export const CREATE_LOYALTY_REWARD = gql``