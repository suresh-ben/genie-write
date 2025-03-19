import React from 'react'

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">About Genie Write</h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                    Genie Write is your AI-powered writing assistant, designed to help you generate, 
                    refine, and enhance your content with ease. Whether you're crafting blog posts, 
                    emails, essays, or creative stories, Genie Write empowers you with smart suggestions 
                    and seamless editing.
                </p>

                <h2 className="text-2xl font-semibold text-gray-700 mt-6">Why Choose Genie Write?</h2>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
                    <li>🚀 AI-powered writing assistance</li>
                    <li>📝 Instant content suggestions & improvements</li>
                    <li>🎯 Grammar & style enhancements</li>
                    <li>🌍 Supports multiple languages</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-700 mt-6">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                    At Genie Write, we believe in making writing effortless for everyone. Whether you're a 
                    student, a professional, or a content creator, our goal is to provide the best AI-driven 
                    writing experience to help you communicate effectively.
                </p>

                <h2 className="text-2xl font-semibold text-gray-700 mt-6">Get Started</h2>
                <p className="text-gray-600 text-lg">
                    Ready to enhance your writing? Try Genie Write today and experience the power of AI-assisted 
                    content creation.
                </p>

                <div className="mt-6">
                    <a href="/" className="text-blue-600 hover:underline font-semibold">
                        Back to Home →
                    </a>
                </div>
            </div>
        </div>
    );
}

