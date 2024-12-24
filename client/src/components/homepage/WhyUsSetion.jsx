

const WhyUsSection = () => {
    const data = [
        {
            title: 'Minimize Food Waste',
            description: 'List surplus food easily and cut down on food waste, making a sustainable impact.',
            imageUrl: 'https://cdn.usegalileo.ai/sdxl10/2631b021-6eee-466a-b401-6466298bd322.png',
        },
        {
            title: 'Help those in need',
            description: 'Donate surplus food to those who need it most, helping to alleviate hunger in your local community.',
            imageUrl: 'https://cdn.usegalileo.ai/sdxl10/4b5629e6-9490-45b7-93dd-14cdf74e660a.png',
        },
        {
            title: 'Enhance Your Brand',
            description: 'Using FoodShare, you can show your customers that you care about more than just profit.',
            imageUrl: 'https://cdn.usegalileo.ai/stability/73922148-0100-41bc-85fa-1d906880ae0a.png',
        },
        {
            title: 'Join a growing community',
            description: 'Join a network of restaurants and NGOs who are making a difference.',
            imageUrl: 'https://cdn.usegalileo.ai/sdxl10/0af2463c-7025-41d2-98db-e20a23ad8e3a.png',
        },
    ];

    return (
        <section id="WhyUs" className="min-h-screen flex flex-col justify-center gap-10">
            <div className="max-w-3xl py-10 text-center space-y-4 mx-auto">
                <h2 className="text-4xl font-semibold">Why Choose FoodShare?</h2>
                <p className="text-base">Discover the benefits of using FoodShare — from reducing waste to supporting those in need, while positively impacting your community and business.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((item, index) => {
                    return <div key={index}>
                        <img src={item.imageUrl} className="w-full aspect-[16/11] rounded-xl" />
                        <div className="my-5 text-center space-y-1">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm text-yellow-700">{item.description}</p>
                        </div>
                    </div>
                })}
            </div>
        </section>
    )
}

export default WhyUsSection;