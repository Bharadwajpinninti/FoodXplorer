import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import Loader from "./Loader";
import { BASE_URL } from "../constants/constant";
import {
  FaHome,
  FaMapMarkerAlt,
  FaUtensils,
  FaMoneyBillWave,
  FaStar,
  FaLink,
  FaRegImages,
  FaConciergeBell,
  FaRegClock,
  FaBookmark,
} from "react-icons/fa";
import BgImage from "../assets/Bg.jpg";

const RestaurantDetail = () => {
  const { resId } = useParams();
  const [resInfo, setResInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/restaurants/${resId}`);
      if (!response.ok) throw new Error("Restaurant not found");
      setResInfo(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [resId]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-center text-red-400">{error}</div>;
  if (!resInfo) return null;

  const {
    name,
    cuisines,
    average_cost_for_two,
    currency,
    location,
    user_rating,
    url,
    featured_image,
    photos_url,
    menu_url,
    events_url,
    has_online_delivery,
    has_table_booking,
    is_delivering_now,
    price_range,
  } = resInfo;

  return (
    <div
      className="min-h-screen bg-black p-4 md:p-6 md:bg-contain"
      style={{
        backgroundImage: window.innerWidth >= 1000 ? `url(${BgImage})` : "none",
      }}
    >
      <div className="max-w-4xl mx-auto bg-black bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="mb-6 flex items-center gap-4 text-orange-500 font-semibold">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-orange-400 transition-all"
          >
            <FaHome className="text-xl" /> Back to Home
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-wide">
          {name}
        </h1>

        {featured_image && (
          <img
            className="w-full h-64 md:h-72 object-cover rounded-xl mb-8 shadow-lg border border-gray-700 hover:scale-[1.02] transition-transform duration-300"
            src={featured_image}
            alt={name}
          />
        )}

        <div className="space-y-5 text-white font-light">
          <p className="flex items-center gap-3 text-lg">
            <FaUtensils className="text-orange-500" /> {cuisines}
          </p>
          <p className="flex items-center gap-3 text-lg">
            <FaMoneyBillWave className="text-orange-500" />{" "}
            {average_cost_for_two} {currency} (for two)
          </p>
          <p className="flex items-center gap-3 text-lg">
            <FaMoneyBillWave className="text-orange-500" /> Price Range:{" "}
            <span className="font-medium">{price_range}/5</span>
          </p>
          <p className="flex items-center gap-3 text-lg">
            <FaStar className="text-green-500" />{" "}
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              {user_rating?.aggregate_rating || "N/A"} stars
            </span>
          </p>
          <p className="flex items-center gap-3 text-lg">
            <FaMapMarkerAlt className="text-orange-500" /> {location.address},{" "}
            {location.city}
          </p>
          <p className="flex items-center gap-3 text-lg">
            <FaConciergeBell className="text-orange-500" /> Online Delivery:{" "}
            <span className="font-medium">
              {has_online_delivery ? "Yes" : "No"}
            </span>
          </p>
          <p className="flex items-center gap-3 text-lg">
            <FaRegClock className="text-orange-500" /> Delivering Now:{" "}
            <span className="font-medium">
              {is_delivering_now ? "Yes" : "No"}
            </span>
          </p>
          <p className="flex items-center gap-3 text-lg">
            <FaBookmark className="text-orange-500" /> Table Booking:{" "}
            <span className="font-medium">
              {has_table_booking ? "Yes" : "No"}
            </span>
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {photos_url && (
              <a
                href={photos_url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-all flex items-center gap-2 shadow-md"
              >
                <FaRegImages /> Photos
              </a>
            )}
            {menu_url && (
              <a
                href={menu_url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-all flex items-center gap-2 shadow-md"
              >
                <FaUtensils /> Menu
              </a>
            )}
            {events_url && (
              <a
                href={events_url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-all flex items-center gap-2 shadow-md"
              >
                <FaLink /> Events
              </a>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-all flex items-center gap-2 shadow-md"
              >
                <FaLink /> Zomato
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
