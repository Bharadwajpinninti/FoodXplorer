const RestaurantCard = ({ resData }) => {
  const { name, cuisines, average_cost_for_two, currency, user_rating } =
    resData;
  const rating = user_rating?.aggregate_rating || "N/A";

  return (
    <div className="p-4 bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] flex flex-col items-center text-center h-72 w-full max-w-[250px] transform hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all duration-300">
      <img
        className="w-full h-32 object-cover rounded-lg mb-3"
        alt={name}
        src={resData.featured_image || "https://via.placeholder.com/150"}
      />
      <h3 className="font-bold text-lg text-black mb-1 line-clamp-1">{name}</h3>
      <h4 className="text-sm text-gray-600 mb-1 break-words line-clamp-2">
        {cuisines}
      </h4>
      <h4 className="text-sm text-white bg-green-600 px-2 py-1 rounded-md mb-1">
        {rating} ⭐
      </h4>
      <h4 className="text-sm text-gray-600">
        {average_cost_for_two} {currency}
      </h4>
    </div>
  );
};

export default RestaurantCard;
