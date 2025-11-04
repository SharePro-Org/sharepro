import { gql } from "@apollo/client";

export const CREATE_FAQ = gql`
  mutation createFaq($answer: String!, $category: String!, $question: String!) {
    createFaq(answer: $answer, category: $category, question: $question) {
      success
      message
    }
  }
`;

export const CREATE_WALKTHROUGH_VIDEO = gql`
  mutation createWalkthroughVideo(
    $input: WalkThroughVideoInput!
  ) {
    createWalkthroughVideo(
      input: $input
    ) {
      success
      message
      errors
    }
  }
`;

export const UPDATE_WALKTHROUGH_VIDEO = gql`
  mutation updateWalkthroughVideo(
    $id: ID!
    $input: WalkThroughVideoInput!
  ) {
    updateWalkthroughVideo(
      id: $id,
      input: $input
    ) {
      success
      message
      errors
    }
  }
`;
