const About = () => (
  <div className="mt-16 w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12 text-center">
    <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-ballblack">
      About Planet Futsal
    </h1>
    <p className="text-lg text-ballblack/80 mb-8">
      Planet Futsal is dedicated to providing the best futsal experience in the
      city. Our courts are designed for both casual and competitive play, with a
      focus on quality, safety, and community.
    </p>
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-ballgreen/10 rounded-2xl p-6 flex flex-col items-center">
        <span className="text-4xl mb-2">🌟</span>
        <h3 className="font-bold text-ballgreen mb-2">Our Vision</h3>
        <p className="text-sm text-ballblack">
          To be the leading futsal center, inspiring healthy lifestyles and
          sportsmanship.
        </p>
      </div>
      <div className="bg-ballorange/10 rounded-2xl p-6 flex flex-col items-center">
        <span className="text-4xl mb-2">🤝</span>
        <h3 className="font-bold text-ballorange mb-2">Our Values</h3>
        <p className="text-sm text-ballblack">
          Community, respect, and excellence in every match and service.
        </p>
      </div>
      <div className="bg-ballblack/10 rounded-2xl p-6 flex flex-col items-center">
        <span className="text-4xl mb-2">⚽</span>
        <h3 className="font-bold text-ballblack mb-2">Our Facility</h3>
        <p className="text-sm text-ballblack">
          Premium courts, modern amenities, and a welcoming environment for all
          ages.
        </p>
      </div>
    </div>
    <p className="text-ballblack/70">
      Join us and experience futsal like never before!
    </p>
  </div>
);

export default About;
