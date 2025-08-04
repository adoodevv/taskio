import { FaStar } from "react-icons/fa";

const reviews = [
   {
      name: 'Theresa Adjaidoo',
      review: 'I asked for a delivery of a fridge and Taskio was there to help me. He was very helpful and I was very happy with the service.',
      rating: 5,
   },
   {
      name: 'Bregaitha Agyekum',
      review: 'The service was great. I was very happy with the service.',
      rating: 4,
   },
   {
      name: 'Caleb Alhassan',
      review: 'I posted my services and got great customers. I was very happy with the service.',
      rating: 4,
   }
]

const Reviews = () => {
   return (
      <div className="bg-blue-50">
         <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">See What Happy Customers Are Saying About Taskio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
               {reviews.map((review) => (
                  <div key={review.name}>
                     <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{review.name}</h3>
                        <div className="flex items-center gap-1">
                           {Array.from({ length: review.rating }).map((_, index) => (
                              <FaStar key={index} className="text-yellow-500" />
                           ))}
                        </div>
                     </div>
                     <p className="text-sm text-gray-500 max-w-sm">{review.review}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Reviews
