import { Target, Users, Award, MapPin, Clock, Trophy } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Target,
      title: "Our Vision",
      description: "To be the leading futsal center, inspiring healthy lifestyles and sportsmanship.",
      color: "ballgreen",
      bgColor: "from-ballgreen/20 to-emerald-100"
    },
    {
      icon: Users,
      title: "Our Values", 
      description: "Community, respect, and excellence in every match and service.",
      color: "ballorange",
      bgColor: "from-ballorange/20 to-orange-100"
    },
    {
      icon: Award,
      title: "Our Facility",
      description: "Premium courts, modern amenities, and a welcoming environment for all ages.",
      color: "ballblack",
      bgColor: "from-gray-200 to-gray-100"
    }
  ];

  const stats = [
    { icon: Trophy, number: "500+", label: "Happy Players", color: "text-ballgreen" },
    { icon: MapPin, number: "3", label: "Premium Courts", color: "text-ballorange" },
    { icon: Clock, number: "24/7", label: "Open Hours", color: "text-ballgreen" },
    { icon: Award, number: "5★", label: "Rating", color: "text-ballorange" }
  ];

  return (
    <div className="mt-16 w-full max-w-5xl mx-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ballgreen/5 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-ballgreen/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-ballgreen via-green-500 to-ballorange bg-clip-text text-transparent animate-pulse">
            About Planet Futsal
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Planet Futsal is dedicated to providing the best futsal experience in the city. 
            Our courts are designed for both casual and competitive play, with a focus on 
            quality, safety, and community.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-3">
                <stat.icon className={`w-8 h-8 mx-auto ${stat.color}`} />
              </div>
              <div className={`text-3xl font-black mb-2 ${stat.color}`}>
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative bg-gradient-to-br ${feature.bgColor} rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Animated Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold text-${feature.color} mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  {feature.title}
                </h3>
                
                <p className="text-sm text-ballblack/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-ballgreen/10 via-emerald-50 to-ballorange/10 rounded-3xl">
            <p className="text-xl font-bold text-ballblack mb-2">
              Ready to Experience the Best?
            </p>
            <p className="text-gray-700 mb-6 max-w-md">
              Join us and experience futsal like never before! Book your court today and become part of our amazing community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/courts" 
                className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-ballgreen to-emerald-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">View Our Courts</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-ballgreen transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </a>
              
              <a 
                href="/contact" 
                className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-ballorange to-orange-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-ballorange transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default About;
