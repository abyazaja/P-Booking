const Contact = () => (

    <div className="w-full max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-ballblack text-center">Contact Us</h1>
      <div className="mb-8 text-center">
        <p className="text-ballblack/80">Have questions or want to book by phone? Reach out to us!</p>
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-4">
          <div className="flex-1 bg-ballgreen/10 rounded-xl p-4">
            <p className="font-semibold text-ballgreen">Phone</p>
            <p className="text-ballblack">+62 812-3456-7890</p>
          </div>
          <div className="flex-1 bg-ballorange/10 rounded-xl p-4">
            <p className="font-semibold text-ballorange">Email</p>
            <p className="text-ballblack">info@planetfutsal.com</p>
          </div>
        </div>
      </div>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Your Name" className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen" />
        <input type="email" placeholder="Your Email" className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen" />
        <textarea placeholder="Your Message" rows={4} className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen" />
        <button type="submit" className="bg-ballgreen text-white py-2 rounded-full font-semibold hover:bg-ballgreen/90 transition">Send Message</button>
      </form>
    </div>
);

export default Contact; 