import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Briefcase, GraduationCap, BookOpen } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { PieChart } from '../components/PieChart';
import backgroundImage from '../assets/chinese-calligraphy.jpeg';

const courseCategories = [
  {
    id: 1,
    title: "Survival Chinese",
    icon: Heart,
    description: "Essential for emergency communication, focusing on quick listening and speaking responses while only requiring basic sign recognition. Writing is less important, and simple cultural etiquette covers most needs when visiting a new country",
    color: "#DC2626", // red
    stats: [
      { subject: 'Listening', value: 100 },
      { subject: 'Speaking', value: 100 },
      { subject: 'Reading', value: 50 },
      { subject: 'Writing', value: 20 },
      { subject: 'Cultural Adaptation', value: 70 }
    ]
  },
  {
    id: 2,
    title: "Parent-Kid Chinese",
    icon: Users,
    description: "Centers on making Chinese culture fun and meaningful for kids, so they naturally want to learn the language through stories, games and activities. ",
    color: "#3498DB", // blue
    stats: [
      { subject: 'Listening', value: 80 },
      { subject: 'Speaking', value: 80 },
      { subject: 'Reading', value: 30 },
      { subject: 'Writing', value: 30 },
      { subject: 'Cultural Adaptation', value: 100 }
    ]
  },
  {
    id: 3,
    title: "Business Chinese",
    icon: Briefcase,
    description: "Critical for professional verbal communication and understanding business culture, requiring moderate reading/writing for emails but prioritizing negotiation skills.",
    color: "#2ECC71", // green
    stats: [
      { subject: 'Listening', value: 100 },
      { subject: 'Speaking', value: 100 },
      { subject: 'Reading', value: 60 },
      { subject: 'Writing', value: 60 },
      { subject: 'Cultural Adaptation', value: 80 }
    ]
  },
  {
    id: 4,
    title: "Homework Tutoring Chinese",
    icon: GraduationCap,
    description: "Homework Tutoring Chinese focuses entirely on each student's individual needs, lesson adapts to their specific challenges, learning style, and academic goals—turning homework struggles into confident success.",
    color: "#F39C12", // orange
    stats: [
      { subject: 'Listening', value: 0 },
      { subject: 'Speaking', value: 0 },
      { subject: 'Reading', value: 0 },
      { subject: 'Writing', value: 0 },
      { subject: 'Cultural Adaptation', value: 0 }
    ]
  },
  {
    id: 5,
    title: "Academic Chinese",
    icon: BookOpen,
    description: "Comprehensively develops students' academic Chinese proficiency, including HSK test preparation and advanced scholarly language skills.",
    color: "#9B59B6", // purple
    stats: [
      { subject: 'Listening', value: 90 },
      { subject: 'Speaking', value: 90 },
      { subject: 'Reading', value: 90 },
      { subject: 'Writing', value: 90 },
      { subject: 'Cultural Adaptation', value: 40 }
    ]
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const blurAmount = Math.min(scrollY / 100, 10);

  const handleSectorClick = (index: number) => {
    setCurrentIndex(index);
  };

  const CurrentIcon = courseCategories[currentIndex].icon;

  return (
    <>
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-fixed transition-all duration-300"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: `blur(${blurAmount}px)`
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-calligraphy text-white mb-6">
            Learning Chinese is embracing a 5,000-year-old culture
          </h1>
          <p className="text-xl text-gray-200 font-serif mb-8">
            Immerse yourself in language and tradition through personalized lessons
          </p>
          <button 
            onClick={() => navigate('/about-chinese')}
            className="bg-black text-white px-8 py-3 rounded-full font-calligraphy hover:bg-gray-900 transition-colors"
          >
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Course Showcase with Pie Chart */}
      <div className="py-16 overflow-hidden">
        <div className="flex items-start">
          {/* Left side - Pie Chart positioned so red and purple edges touch left edge */}
          <div className="flex-shrink-0" style={{ marginLeft: '-400px' }}>
            <PieChart onSectorClick={handleSectorClick} selectedIndex={currentIndex} />
          </div>

          {/* Right side - Course Details and Radar Chart */}
          <div className="flex-1 max-w-4xl mx-auto px-8" style={{ marginTop: '40px' }}>
            <div className="bg-white rounded-3xl shadow-2xl p-12 transition-all duration-500 transform min-h-[700px] w-full">
              <div className="text-center mb-12">
                <div className="transition-all duration-500">
                  <CurrentIcon 
                    className="h-24 w-24 mx-auto mb-6 transition-all duration-500" 
                    style={{ color: courseCategories[currentIndex].color }} 
                  />
                </div>
                <h2 className="text-5xl font-calligraphy mb-6 transition-all duration-500">
                  {courseCategories[currentIndex].title}
                </h2>
                <p className="text-2xl text-gray-600 font-serif transition-all duration-500 leading-relaxed max-w-3xl mx-auto">
                  {courseCategories[currentIndex].description}
                </p>
              </div>
              
              <div className="h-80 mb-12">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={courseCategories[currentIndex].stats}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 14 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Radar
                      name={courseCategories[currentIndex].title}
                      dataKey="value"
                      stroke={courseCategories[currentIndex].color}
                      fill={courseCategories[currentIndex].color}
                      fillOpacity={0.6}
                      strokeWidth={3}
                      className="transition-all duration-500"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate('/courses')}
                  className="bg-black text-white px-12 py-4 rounded-full font-calligraphy hover:bg-gray-900 transition-colors text-lg"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;