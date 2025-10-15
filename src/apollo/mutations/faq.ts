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
    $category: String!,
    $name: String!,
    $description: String!,
    $thumbnailUrl: String!,
    $videoUrl: String!
  ) {
    createWalkthroughVideo(
      category: $category,
      name: $name,
      description: $description,
      thumbnailUrl: $thumbnailUrl,
      videoUrl: $videoUrl
    ) {
      success
      message
      errors
    }
  }
`;

