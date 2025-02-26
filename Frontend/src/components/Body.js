import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RestaurantCard from "./RestaurantCard";
import { Link } from "react-router";
import {
  fetchRestaurants,
  fetchMoreRestaurants,
  resetRestaurants,
} from "../constants/restaurantSlice";
import {
  fetchRestaurantsByLocation,
  clearLocationResults,
} from "../constants/locationSlice";
import {
  fetchRestaurantsByImage,
  clearImageResults,
} from "../constants/imageSearchSlice";
import { setSearching } from "../constants/searchSlice";
import Loader from "./Loader";
import { FaSearchLocation, FaImage, FaHome, FaArrowDown } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";

const Body = () => {
  const dispatch = useDispatch();

  // Redux states
  const {
    list: restaurants,
    loading: loadingRestaurants,
    error: errorRestaurants,
  } = useSelector((state) => state.restaurants);
  const {
    list: locationResults,
    loading: loadingLocation,
    error: errorLocation,
  } = useSelector((state) => state.locationRestaurants);
  const {
    list: imageResults,
    detectedFood,
    loading: loadingImage,
    error: errorImage,
  } = useSelector((state) => state.imageSearchRestaurants);
  const isSearching = useSelector((state) => state.search.isSearching);

  // Local states for inputs and popup visibility
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [radius, setRadius] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);

  // Fetch initial restaurants on mount
  useEffect(() => {
    dispatch(fetchRestaurants(1));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchMoreRestaurants(restaurants.length / 10 + 1));
  };

  const handleLocationSearch = () => {
    if (!lat || !lon || !radius) {
      alert("Please enter latitude, longitude, and radius");
      return;
    }
    dispatch(setSearching(true));
    dispatch(clearImageResults());
    dispatch(fetchRestaurantsByLocation({ lat, lon, radius }));
    setLat("");
    setLon("");
    setRadius("");
    setShowLocationPopup(false);
  };

  const handleImageSearch = () => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }
    dispatch(setSearching(true));
    dispatch(clearLocationResults());
    dispatch(clearImageResults());
    const formData = new FormData();
    formData.append("image", imageFile);
    dispatch(fetchRestaurantsByImage(formData));
    setImageFile(null);
    setShowImagePopup(false);
  };

  const handleHomeClick = () => {
    dispatch(setSearching(false));
    dispatch(clearLocationResults());
    dispatch(clearImageResults());
    dispatch(resetRestaurants());
    dispatch(fetchRestaurants(1));
  };

  const results = isSearching
    ? locationResults?.length > 0
      ? locationResults
      : imageResults || []
    : restaurants || [];

  const displayError =
    !results.length &&
    (isSearching ? errorLocation || errorImage : errorRestaurants);

  return (
    <div className="min-h-screen text-black bg-gray-100 flex items-center justify-center p-4 md:p-6">
      <div className="container mx-auto w-full max-w-6xl flex flex-col items-center h-screen">
        {/* Search Trigger Buttons and Conditional Home Button */}
        <div className="w-full flex flex-col items-center md:flex-row md:justify-center gap-4 mb-6">
          <button
            onClick={() => setShowLocationPopup(true)}
            className="w-full max-w-xs md:w-auto bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 border border-gray-300 transition flex items-center justify-center gap-2"
          >
            <FaSearchLocation /> Search by Location
          </button>
          <button
            onClick={() => setShowImagePopup(true)}
            className="w-full max-w-xs md:w-auto bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 border border-gray-300 transition flex items-center justify-center gap-2"
          >
            <FaImage /> Search by Image
          </button>
          {isSearching && (
            <button
              onClick={handleHomeClick}
              className="w-full max-w-xs md:w-auto bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 border border-gray-300 transition flex items-center justify-center gap-2"
            >
              <FaHome /> Home
            </button>
          )}
        </div>

        {/* Location Search Popup */}
        {showLocationPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Search by Location
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="number"
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500 transition"
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500 transition"
                />
                <input
                  type="number"
                  placeholder="Radius (km)"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-500 transition"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleLocationSearch}
                    className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 border border-gray-300 transition"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setShowLocationPopup(false)}
                    className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 border border-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Search Popup */}
        {showImagePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Search by Image
              </h2>
              <div className="flex flex-col gap-4">
                <label className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-center hover:bg-gray-100 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  <span className="text-gray-600">
                    {imageFile ? imageFile.name : "Choose File"}
                  </span>
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={handleImageSearch}
                    className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 border border-gray-300 transition"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setShowImagePopup(false)}
                    className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 border border-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detected Cuisine */}
        {detectedFood && isSearching && (
          <div className="w-full bg-white border border-gray-300 p-4 rounded-2xl shadow-lg mb-6 flex items-center gap-3">
            <MdRestaurant className="text-orange-500 text-2xl" />
            <p className="text-xl text-black">
              Detected Cuisine:{" "}
              <span className="font-semibold text-orange-500">
                {detectedFood}
              </span>
            </p>
          </div>
        )}

        {/* Loader */}
        {(loadingRestaurants || loadingLocation || loadingImage) && (
          <div className="flex-grow flex items-center justify-center">
            <Loader />
          </div>
        )}

        {/* Error Display */}
        {displayError && (
          <div className="w-full bg-red-100 border border-gray-300 p-4 rounded-2xl text-red-600 mb-6">
            {displayError}
          </div>
        )}

        {/* Results */}
        <div className="flex-grow overflow-y-auto w-full flex flex-col items-center no-scrollbar">
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {Array.isArray(results) && results.length > 0
                ? results.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to={`/restaurants/${restaurant.id}`}
                      className="w-full flex justify-center"
                    >
                      <RestaurantCard resData={restaurant} />
                    </Link>
                  ))
                : !loadingRestaurants &&
                  !loadingLocation &&
                  !loadingImage && (
                    <p className="text-center text-gray-600 col-span-full">
                      No restaurants found. Try adjusting your search. Click on
                      the Home button to reset.
                    </p>
                  )}
            </div>
          </div>

          {/* Load More Button */}
          {!isSearching && restaurants?.length > 0 && !loadingRestaurants && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="bg-orange-500 text-white px-8 py-3 mb-16 rounded-lg hover:bg-orange-600 border border-gray-300 transition flex items-center"
              >
                <FaArrowDown /> Show More
              </button>
            </div>
          )}
          <div className="mb-16"></div>
        </div>
      </div>
    </div>
  );
};

export default Body;
