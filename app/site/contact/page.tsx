export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold mb-4">Contact</h1>
        <p className="text-lg text-gray-600">
          Get in touch for questions or to discuss your project
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-3">
              <p className="flex items-center gap-3">
                <span className="font-medium">Email:</span>
                <a href="mailto:german.gladkov@gmail.com" className="text-blue-600 hover:underline">
                  german.gladkov@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-3">
                <span className="font-medium">Location:</span>
                <span>SF Bay Area</span>
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
            <p className="text-gray-600">
              I typically respond to emails within 24 hours. For urgent matters, 
              please mention "URGENT" in your subject line.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Service Areas</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Remote computer help (worldwide)</li>
              <li>• Distance Reiki sessions (worldwide)</li>
              <li>• In-person services (SF Bay Area)</li>
              <li>• Plant care & outdoor work (local)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Booking Preferred</h3>
            <p className="text-gray-600 mb-3">
              For fastest service, use our online booking system:
            </p>
            <a 
              href="/availability" 
              className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
