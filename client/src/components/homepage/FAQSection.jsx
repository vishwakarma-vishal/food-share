import React from 'react';
import { FaQuestionCircle, FaHandsHelping, FaInfoCircle, FaUserFriends, FaMoneyBillWave, FaDonate } from 'react-icons/fa'; // Import different icons

const FAQSection = () => {
    const faqs = [
        {
            question: 'What is FoodShare?',
            answer: 'FoodShare is a platform that connects restaurants and NGOs to reduce food waste and help those in need by donating surplus food.',
            icon: <FaInfoCircle size={24} className="text-[#ee7f2b]" />
        },
        {
            question: 'How does FoodShare work?',
            answer: 'Restaurants can list their surplus food on FoodShare, which NGOs can then access to collect and distribute to individuals in need.',
            icon: <FaHandsHelping size={24} className="text-[#ee7f2b]" />
        },
        {
            question: 'Is there a cost to use FoodShare?',
            answer: 'No, using FoodShare is completely free for both restaurants and NGOs. Our mission is to minimize food waste and alleviate hunger.',
            icon: <FaMoneyBillWave size={24} className="text-[#ee7f2b]" />
        },
        {
            question: 'How can I sign up?',
            answer: 'You can sign up by clicking the "Sign up" button on our homepage and filling out the registration form for either restaurants or NGOs.',
            icon: <FaUserFriends size={24} className="text-[#ee7f2b]" />
        },
        {
            question: 'Can I donate food directly to individuals?',
            answer: 'FoodShare primarily facilitates donations through registered NGOs that distribute food to individuals in need.',
            icon: <FaDonate size={24} className="text-[#ee7f2b]" />
        },
        {
            question: 'How can I contact FoodShare?',
            answer: 'You can reach out to us through our Contact Us page, where you can find our email address and phone number for support.',
            icon: <FaQuestionCircle size={24} className="text-[#ee7f2b]" />
        },
    ];

    return (
        <section id="faq" className="min-h-screen flex flex-col justify-center gap-10">
            <h2 className="text-4xl font-semibold text-center">Frequently Asked Questions</h2>

            <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6'>
                {
                    faqs.map((faq, index) => {
                        return (
                            <div key={index} className='bg-[#f3ece7] flex items-start gap-3 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200'>
                                <div className='mt-1'>
                                    {faq.icon}
                                </div>
                                <div>
                                    <h3 className='text-lg font-semibold'>{faq.question}</h3>
                                    <p className='mt-1 text-sm text-[#4a4a4a]'>{faq.answer}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default FAQSection;