import { gql } from "@apollo/client";

export const CREATE_FAQ = gql`
  mutation createFaq($answer: String!, $category: String!, $question: String!) {
    createFaq(answer: $answer, category: $category, question: $question) {
      success
      message
    }
  }
`;
