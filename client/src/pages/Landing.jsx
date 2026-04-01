import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Building,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const Landing = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append("keyword", search);
    if (location) params.append("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
      title: "Lorem ipsum dolor sit.",
      desc: "Natus beatae tempora modi error, ullam eaque. Omnis tempora culpa explicabo hic!",
    },
    {
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fHww",
      title: "Second Slide Title",
      desc: "Beautiful UI designs start with simple layouts.",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
      title: "Third Slide",
      desc: "Create modern websites with React and Tailwind.",
    },
    {
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      title: "Fourth Slide",
      desc: "Keep your UI clean and user-friendly.",
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="flex gap-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              The Premier Job Platform for{" "}
              <span className="text-accent">Healthcare Professionals</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl">
              Connect with top hospitals and medical institutions. Find your
              next career opportunity in medicine with DrHire.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-xl p-3 flex flex-col sm:flex-row gap-3 shadow-2xl"
            >
              <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 py-3">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Job Title or Keyword"
                  className="bg-transparent w-full text-slate-900 focus:outline-none"
                />
              </div>
              <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 py-3">
                <MapPin className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, state, or zip code"
                  className="bg-transparent w-full text-slate-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors sm:w-auto w-full"
              >
                Search Jobs
              </button>
            </form>
          </div>

          <div className="relative w-full h-[430px] overflow-hidden rounded-xl shadow-lg">
            {/* Image */}
            <img
              src={slides[current].image}
              alt="slide"
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Dots */}
            <div className="absolute bottom-4 w-full flex justify-center gap-2">
              {slides.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    i === current ? "bg-white" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl shadow-xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/20 blur-3xl shadow-lg"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-slate-900 mb-2">5,000+</p>
              <p className="text-slate-500 font-medium">Healthcare Jobs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900 mb-2">1,200+</p>
              <p className="text-slate-500 font-medium">Verified Hospitals</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900 mb-2">50k+</p>
              <p className="text-slate-500 font-medium">Active Doctors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900 mb-2">98%</p>
              <p className="text-slate-500 font-medium">Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Discover Opportunities by Specialty
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Explore high-demand medical fields and find jobs tailored to your
              expertise.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Cardiology",
                image:
                  "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2FyZGlvbG9naXN0fGVufDB8fDB8fHww",
              },
              {
                name: "Neurology",
                image:
                  "https://plus.unsplash.com/premium_photo-1733306534776-d87b7fa2d6e3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                name: "Pediatrics",
                image:
                  "https://images.unsplash.com/photo-1632053002928-1919605ee6f7?q=80&w=1178&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                name: "Orthopedics",
                image:
                  "https://plus.unsplash.com/premium_photo-1726869610210-de13ad4cf226?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
            ].map((item, i) => (
              <Link
                key={i}
                to={`/jobs?specialization=${item.name}`}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white text-xl font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-200 mt-1">View Jobs →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-10 text-center">
                Featured Jobs
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((job, i) => (
                  <div
                    key={i}
                    className="border rounded-xl p-6 hover:shadow-xl transition"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">
                      Senior Cardiologist
                    </h3>
                    <p className="text-slate-500 mt-1">Apollo Hospital</p>
                    <p className="text-sm text-slate-400 mt-2">Delhi, India</p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-primary font-semibold">
                        ₹2L - ₹5L/month
                      </span>
                      <Link
                        to="/jobs"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Apply →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-12">How It Works</h2>

              <div className="grid md:grid-cols-3 gap-10">
                {[
                  {
                    title: "Create Profile",
                    desc: "Sign up and build your professional medical profile.",
                  },
                  {
                    title: "Apply for Jobs",
                    desc: "Search and apply to jobs from top hospitals.",
                  },
                  {
                    title: "Get Hired",
                    desc: "Connect with recruiters and land your dream job.",
                  },
                ].map((step, i) => (
                  <div key={i} className="p-6 bg-white rounded-xl shadow">
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-500">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-10">
                Trusted by Leading Hospitals
              </h2>

              <div className="flex flex-wrap justify-center gap-10 items-center opacity-70">
                {["Apollo", "Fortis", "Max", "AIIMS", "Manipal"].map(
                  (name, i) => (
                    <div
                      key={i}
                      className="text-xl font-semibold text-slate-600"
                    >
                      {name}
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>

       <section className="py-24 bg-slate-100">
  <div className="max-w-5xl mx-auto text-center">
    <h2 className="text-3xl font-bold mb-12">What Doctors Say</h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Doctor 1 */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-slate-600">
          “I found my dream job within 2 weeks using this platform. Highly recommended!”
        </p>
        <h4 className="mt-4 font-semibold">Dr. Sharma</h4>
      </div>

      {/* Doctor 2 */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-slate-600">
          “The opportunities here are top-notch. I received multiple offers from prestigious hospitals.”
        </p>
        <h4 className="mt-4 font-semibold">Dr. Mehta</h4>
      </div>

      {/* Doctor 3 */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-slate-600">
          “A seamless experience from application to placement. The support team is exceptional.”
        </p>
        <h4 className="mt-4 font-semibold">Dr. Kaur</h4>
      </div>

      {/* Doctor 4 */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-slate-600">
          “I love how this platform connects you with clinics that match your values and expertise.”
        </p>
        <h4 className="mt-4 font-semibold">Dr. Reddy</h4>
      </div>

      {/* Doctor 5 */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-slate-600">
          “Finally, a job platform designed specifically for medical professionals. Truly a game-changer.”
        </p>
        <h4 className="mt-4 font-semibold">Dr. Nair</h4>
      </div>
    </div>
  </div>
</section>

          <section className="py-20 bg-primary text-center text-white rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Get Job Alerts Instantly
            </h2>
            <p className="mb-6 text-indigo-100">
              Subscribe to receive latest medical job openings.
            </p>

            <div className="flex justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg w-full text-white border-white "
              />
              <button className="bg-white text-primary px-6 rounded-lg font-semibold">
                Subscribe
              </button>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-600 transition"
            >
              Explore All Specialties
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-primary text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Advance Your Medical Career?
          </h2>
          <p className="text-indigo-100 text-lg mb-10">
            Join thousands of healthcare professionals who have found their
            dream jobs through DrHire.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20"
            >
              Create Doctor Profile
            </Link>
            <Link
              to="/register?role=hospital"
              className="bg-transparent border border-indigo-300 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
