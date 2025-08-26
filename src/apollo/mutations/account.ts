export const REGISTER_INVITED_MEMBER = gql`
  mutation RegisterInvitedMember($input: RegisterInviteMemberInput!) {
    registerInvitedMember(input: $input) {
      errors
      message
      success
    }
  }
`;
import { gql } from "@apollo/client";

export const INVITE_MEMBER = gql`
  mutation InviteMember($input: InviteMemberInput!) {
    inviteMember(input: $input) {
      message
      success
      errors
    }
  }
`;

