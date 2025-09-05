"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ArrowLeft, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  GET_FAQS_BY_CATEGORY,
  GET_FAQ_CATEGORIES,
} from "@/apollo/queries/support";
import { useQuery } from "@apollo/client/react";


const HelpCenterView = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesData, loading: categoriesLoading } =
    useQuery(GET_FAQ_CATEGORIES);
  const { data: faqsData, loading: faqsLoading } = useQuery(
    GET_FAQS_BY_CATEGORY,
    {
      variables: { category: selectedCategory },
      skip: !selectedCategory,
    }
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <section className="flex gap-4">
      <div className="w-[40%] bg-white rounded-md p-4">
        <div className="flex gap-2">
          <button onClick={handleGoBack} className="cursor-pointer">
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Help Center</h2>
        </div>
        <div className="flex justify-center items-center gap-3 my-3">
          <div className="relative md:mt-0 mt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
              placeholder="Search By Keyword or topic"
            />

            <SearchIcon
              size={16}
              className="absolute top-4 left-3 text-gray-500"
            />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-sm">
            Search
          </button>
        </div>

        {categoriesLoading ? (
          <div className="py-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            Loading categories...
          </div>
        ) : categoriesData?.faqCategories?.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="border border-[#E5E5EA] rounded-md px-3 my-2"
            value={selectedCategory || undefined}
            onValueChange={(value) => value && handleCategorySelect(value)}
          >
            {categoriesData.faqCategories.map((category: any) => (
              <AccordionItem key={category.category} value={category.category}>
                <AccordionTrigger className="hover:text-primary transition-colors">
                  <div className="flex justify-between items-center w-full mr-4">
                    <span>{category.categoryDisplay}</span>
                  </div>
                </AccordionTrigger>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-4 text-center text-gray-500">
            No categories found
          </div>
        )}
      </div>
      <div className="w-[60%] bg-white rounded-md p-4">
        {selectedCategory ? (
          <>
            <h3 className="text-lg font-semibold mb-4">
              {categoriesData?.faqCategories?.find(
                (cat: any) => cat.category === selectedCategory
              )?.categoryDisplay || selectedCategory}
            </h3>

            {faqsLoading ? (
              <div className="py-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                Loading FAQs...
              </div>
            ) : faqsData?.faqsByCategory?.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqsData.faqsByCategory
                  .filter(
                    (faq: any) =>
                      faq.question
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      faq.answer
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((faq: any) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border border-gray-200 rounded-lg mb-3 px-4"
                    >
                      <AccordionTrigger className="hover:text-primary transition-colors py-4">
                        <div className="flex items-center justify-between w-full text-left">
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div
                          className="text-sm text-gray-700 prose prose-sm max-w-none mb-3"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center text-gray-500">
                {searchQuery
                  ? "No FAQs match your search"
                  : "No FAQs found for this category"}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-medium mb-2">Select a Category</h3>
              <p>Choose a category from the left panel to view FAQs</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HelpCenterView;
