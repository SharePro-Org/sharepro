import { gql } from "@apollo/client";

export const WALKTHROUGH_VIDEOS = gql`
  query walkthroughVideos {
    walkthroughVideos {
      category
      createdAt
      description
      fileUrl
      id
      name
      thumbnail
      isActive
      viewCount
    }
  }
`;

export const FAQS = gql`
  query faqs {
    faqs {
      answer
      category
      categoryDisplay
      id
      isActive
      question
      tagList
      tags
      viewCount
    }
  }
`;


export const FAQ_CATEGORIES = gql`
  query faqCategories {
    faqCategories {
      category
      categoryDisplay
    }
  }
`;