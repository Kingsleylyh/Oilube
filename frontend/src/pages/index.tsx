import Header from '../components/Header';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between mb-24">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6">
              Transparent Cooking Oil Tracking
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Oilube brings blockchain transparency to the cooking oil industry. 
              Track your oil from manufacturer to consumer with immutable records 
              of ingredients, production dates, and supply chain journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
                Track a Product
              </button>
              <button className="px-8 py-4 bg-white text-green-700 border border-green-600 rounded-full font-medium hover:bg-green-50 transition-colors">
                For Manufacturers
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-center text-green-900 mb-16">How Oilube Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Manufacturer Registration', 
                description: 'Manufacturers register products on blockchain with immutable records of ingredients and production dates',
                icon: '🏭'
              },
              { 
                title: 'Supply Chain Tracking', 
                description: 'Each transfer of ownership is recorded on the blockchain as the product moves through the supply chain',
                icon: '📦'
              },
              { 
                title: 'Consumer Verification', 
                description: 'Consumers can verify product authenticity and history by scanning the unique barcode',
                icon: '📱'
              }
            ].map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-green-100">
                <div className="text-5xl mb-6">{step.icon}</div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-white rounded-3xl shadow-lg px-8 mb-24">
          <h2 className="text-4xl font-bold text-center text-green-900 mb-16">About Oilube</h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Founded in 2023, Oilube is revolutionizing the cooking oil industry through blockchain technology. 
              We're committed to bringing transparency and trust to every bottle of cooking oil.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To create a transparent supply chain where consumers can trust the origin and quality 
                  of their cooking oil, and manufacturers can prove the authenticity of their products.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">Why Blockchain?</h3>
                <p className="text-gray-600">
                  Blockchain provides an immutable, tamper-proof record of a product's journey. 
                  This ensures that once information is recorded, it can never be altered or falsified.
                </p>
              </div>
            </div>
            
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-green-800 mb-8 text-center">Our Team</h3>
              <div className="flex justify-center flex-wrap gap-8">
                {[1, 2, 3, 4].map((id) => (
                  <div key={id} className="text-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 mx-auto mb-4" />
                    <h4 className="font-bold text-lg">Team Member {id}</h4>
                    <p className="text-gray-600">Position</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-700 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience Transparency?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join our network of manufacturers and consumers bringing trust to the cooking oil industry.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-white text-green-700 rounded-full font-medium hover:bg-green-50 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-4 bg-transparent text-white border border-white rounded-full font-medium hover:bg-green-800 transition-colors">
              Contact Us
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                <span className="ml-3 text-xl font-bold">OILUBE</span>
              </div>
              <p className="mt-4 text-green-200 max-w-md">
                Blockchain-powered transparency for the cooking oil industry.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-green-200">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Team</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2 text-green-200">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">API</a></li>
                  <li><a href="#" className="hover:text-white">Whitepaper</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-green-200">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                  <li><a href="#" className="hover:text-white">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-green-800 mt-12 pt-8 text-center text-green-400">
            <p>© {new Date().getFullYear()} Oilube. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;