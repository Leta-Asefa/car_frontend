import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

const faqData = [
  {
    category: "Buying",
    questions: [
      {
        q: "How do I buy a car?",
        a: "Browse listings, contact the seller directly, or request a test drive through the listing page.",
      },
      {
        q: "Can I negotiate the price?",
        a: "Yes! Most sellers are open to price negotiation. Use the contact feature on the car detail page.",
      },
    ],
  },
  {
    category: "Selling",
    questions: [
      {
        q: "How do I list my car?",
        a: "Click 'Submit Listing' on the menu, fill in your car's details, upload images, and submit.",
      },
      {
        q: "Is it free to list a car?",
        a: "Yes, listing your car is completely free on our platform.",
      },
    ],
  },
  {
    category: "Payments & Fees",
    questions: [
      {
        q: "Do you offer financing?",
        a: "Some vehicles include financing through third-party lenders. Look for the 'Financing Available' tag.",
      },
      {
        q: "Are there any fees for buyers?",
        a: "No fees are charged to buyers. Transactions are handled directly with the seller.",
      },
    ],
  },
  {
    category: "Support",
    questions: [
      {
        q: "How do I contact support?",
        a: "Click the chat icon or email us at support@yourcarhub.com.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Use the 'Forgot Password' link on the login page to reset your password securely.",
      },
    ],
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let questionIndex = 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
            Frequently Asked Questions
          </h1>

          {faqData.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((faq, idx) => {
                  const index = questionIndex++;
                  return (
                    <div key={index} className="border border-gray-200 rounded-md">
                      <button
                        onClick={() => toggle(index)}
                        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
                      >
                        <span className="text-gray-800 font-medium text-left">{faq.q}</span>
                        <span className="text-xl text-blue-500">{openIndex === index ? "−" : "+"}</span>
                      </button>
                      {openIndex === index && (
                        <div className="px-4 pb-4 text-gray-600">{faq.a}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Faq;
