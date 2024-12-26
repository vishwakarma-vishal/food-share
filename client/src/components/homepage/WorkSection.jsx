

const WorkSection = () => {
    const steps = [
        {
            // imageUrl: "https://cdn.usegalileo.ai/stability/d036c4c2-c3fd-4134-b27d-373339f151e8.png",
            imageUrl: "steps/step-1.jpg",
            title: "List your surplus food",
            description: "Create a simple listing for food that would otherwise go to waste.",
        },
        {
            // imageUrl: "https://cdn.usegalileo.ai/stability/278ff19d-9e79-4ba1-bb61-e21d8a311ee2.png",
            imageUrl: "steps/step-2.jpg",
            title: "Set a pick-up time",
            description: "Set a convenient time for the food to be collected or claimed.",
        },
        {
            // imageUrl: "https://cdn.usegalileo.ai/stability/c2f351db-398b-4cd0-ba57-a6c85c608321.png",
            imageUrl: "steps/step-3.jpg",
            title: "NGOs claim the food",
            description: "Nearby NGOs are alerted when surplus food becomes available.",
        },
        {
            // imageUrl: "https://cdn.usegalileo.ai/stability/278ff19d-9e79-4ba1-bb61-e21d8a311ee2.png",
            imageUrl: "steps/step-4.jpg",
            title: "Food is distributed",
            description: "Collected food is delivered to those who need it the most.",
        },
    ];


    return (
        <section id="Work" className="min-h-screen flex flex-col justify-center gap-10">
            <div>
                <h2 className="text-4xl font-semibold">How it works</h2>
                <ul className="ml-4 my-6 list-disc">
                    <li>A restaurant creates a listing for surplus food and sets a pick-up time.</li>
                    <li>An NGO claims the listing and collects the food.</li>
                    <li>The food is distributed to those in need.</li>
                </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {steps.map((step, index) => {
                    return <div key={index}>
                        <img src={step.imageUrl} className="w-full aspect-video rounded-xl" />
                        <div className="my-5 text-center space-y-1">
                            <h3 className="text-lg font-semibold">{step.title}</h3>
                            <p className="text-sm text-yellow-700">{step.description}</p>
                        </div>
                    </div>
                })}
            </div>
        </section>
    )
}

export default WorkSection;