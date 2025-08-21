import { ChefHat } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ChefHat className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Loading delicious recipes...
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    </div>
  )
}