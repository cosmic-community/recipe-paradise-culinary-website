import { Search, ChefHat, Clock, Users, TrendingUp } from 'lucide-react'
import SearchBar from './SearchBar'
import StarRating from './StarRating'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/80 to-primary-800/80"></div>
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Recipe Paradise
            <span className="block text-2xl md:text-3xl font-normal text-primary-100 mt-2">
              Discover Culinary Excellence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore thousands of delicious recipes from world-class chefs. 
            From quick weeknight dinners to gourmet weekend projects.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">500+</div>
              <div className="text-primary-200 text-sm">Expert Recipes</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">15min</div>
              <div className="text-primary-200 text-sm">Average Cook Time</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">50k+</div>
              <div className="text-primary-200 text-sm">Happy Cooks</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <StarRating 
                  rating={5} 
                  showCount={false} 
                  size="md" 
                  className="text-white"
                />
              </div>
              <div className="text-primary-200 text-sm">Average Rating</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors shadow-lg">
                Explore Recipes
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Meet Our Chefs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}