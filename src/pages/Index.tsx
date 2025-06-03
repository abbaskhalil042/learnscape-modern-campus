import { useState } from "react";
import { Search, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: "all", name: "All Courses" },
    { id: "programming", name: "Programming" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
    { id: "marketing", name: "Marketing" },
    { id: "data-science", name: "Data Science" }
  ];

  const courses = [
    {
      id: 1,
      title: "Complete React Development Course",
      instructor: "Sarah Johnson",
      category: "programming",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.8,
      students: 15420,
      duration: "40 hours",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      description: "Master React from basics to advanced concepts with hands-on projects.",
      level: "Intermediate"
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Michael Chen",
      category: "design",
      price: 79.99,
      originalPrice: 149.99,
      rating: 4.9,
      students: 8932,
      duration: "35 hours",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
      description: "Learn modern UI/UX design principles and create stunning interfaces.",
      level: "Beginner"
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      instructor: "Emma Davis",
      category: "marketing",
      price: 69.99,
      originalPrice: 129.99,
      rating: 4.7,
      students: 12045,
      duration: "25 hours",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      description: "Build comprehensive digital marketing strategies that drive results.",
      level: "Intermediate"
    },
    {
      id: 4,
      title: "Data Science with Python",
      instructor: "Dr. James Wilson",
      category: "data-science",
      price: 99.99,
      originalPrice: 229.99,
      rating: 4.8,
      students: 9876,
      duration: "50 hours",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop",
      description: "Complete data science bootcamp with Python, ML, and AI projects.",
      level: "Advanced"
    },
    {
      id: 5,
      title: "Business Leadership Essentials",
      instructor: "Linda Rodriguez",
      category: "business",
      price: 59.99,
      originalPrice: 119.99,
      rating: 4.6,
      students: 6543,
      duration: "20 hours",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      description: "Develop essential leadership skills for modern business environments.",
      level: "Beginner"
    },
    {
      id: 6,
      title: "Advanced JavaScript & Node.js",
      instructor: "Alex Thompson",
      category: "programming",
      price: 94.99,
      originalPrice: 179.99,
      rating: 4.9,
      students: 11234,
      duration: "45 hours",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
      description: "Master advanced JavaScript concepts and build scalable Node.js applications.",
      level: "Advanced"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (course) => {
    if (!cartItems.find(item => item.id === course.id)) {
      setCartItems([...cartItems, course]);
      toast({
        title: "Added to Cart",
        description: `${course.title} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Already in Cart",
        description: `${course.title} is already in your cart.`,
        variant: "destructive",
      });
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar 
        cartItemCount={cartItems.length}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Learn Without Limits
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of courses from expert instructors and advance your career with cutting-edge skills.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-full shadow-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-red-500 text-white">
                      {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {categories.find(c => c.id === course.category)?.name}
                    </Badge>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-600">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    by {course.instructor}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students.toLocaleString()} students
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">${course.price}</span>
                      <span className="text-lg text-gray-400 line-through">${course.originalPrice}</span>
                    </div>
                    <Button
                      onClick={() => addToCart(course)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <h3 className="text-xl font-bold">EduMaster</h3>
              </div>
              <p className="text-gray-300">
                Empowering learners worldwide with high-quality education and cutting-edge skills.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Programming</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <p className="text-gray-300 mb-4">
                Stay updated with our latest courses and offers.
              </p>
              <div className="flex space-x-2">
                <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 EduMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
