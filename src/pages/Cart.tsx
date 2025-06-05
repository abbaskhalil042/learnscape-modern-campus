
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trash2, ArrowLeft, Star, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Complete React Development Course",
      instructor: "Sarah Johnson",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.8,
      duration: "40 hours",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
      level: "Intermediate"
    }
  ]);

  const removeFromCart = (courseId: number) => {
    setCartItems(cartItems.filter(item => item.id !== courseId));
    toast({
      title: "Course removed",
      description: "The course has been removed from your cart.",
    });
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const originalTotal = cartItems.reduce((total, item) => total + item.originalPrice, 0);
  const totalSavings = originalTotal - subtotal;

  const handleCheckout = () => {
    toast({
      title: "Proceeding to checkout",
      description: "Redirecting to payment...",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EduMaster
              </h1>
            </Link>
            
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} courses in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Looks like you haven't added any courses yet.</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={getLevelColor(item.level)}>
                            {item.level}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-gray-600 mb-3">by {item.instructor}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {item.rating}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.duration}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                            <span className="text-lg text-gray-400 line-through">${item.originalPrice}</span>
                            <Badge className="bg-red-500 text-white">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Original Price</span>
                    <span className="line-through text-gray-500">${originalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>You Save</span>
                    <span className="font-semibold">${totalSavings.toFixed(2)}</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
