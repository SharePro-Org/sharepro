import { gql } from "@apollo/client";

export const ALL_WALKTHROUGH_VIDEOS = gql`
  query GetAllWalkthroughVideos {
    walkthroughVideos {
      id
      name
      description
      category
      fileUrl
      thumbnailUrl
      duration
      order
      isFeatured
      viewCount
      createdAt
    }
  }
`;
export const ALL_FAQS = gql`
  query GetAllFAQs {
    faqs {
      id
      question
      answer
      category
      tags
      order
      isFeatured
      helpfulCount
      viewCount
      createdAt
    }
  }
`;

export const GET_FAQ_CATEGORIES = gql`
  query GetFAQCategories {
    faqCategories {
      category
      categoryDisplay
      count
    }
  }
`;

export const GET_FAQS_BY_CATEGORY = gql`
  query GetFAQsByCategory($category: String!) {
    faqsByCategory(category: $category) {
      id
      question
      answer
      tags
      order
      helpfulCount
      viewCount
    }
  }
`;

export const CREATE_SUPPORT_REQUEST = gql`
  mutation CreateSupportRequest(
    $contactEmail: String!
    $description: String!
    $issueType: String!
    $subject: String!
  ) {
    createSupportRequest(
      contactEmail: $contactEmail
      description: $description
      issueType: $issueType
      subject: $subject
    ) {
      success
      message
      errors
    }
  }
`;
