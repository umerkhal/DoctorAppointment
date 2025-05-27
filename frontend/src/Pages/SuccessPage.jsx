import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const session_id = queryParams.get("session_id");
const token = localStorage.getItem("token")
    if (session_id) {
      // Send to backend to verify payment
      axios.post(
    "http://localhost:4000/api/user/verify-stripe-payment",
    { session_id },
    {
      headers: { token }
    }
  )
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
        .catch(err => {
          console.error("Payment verification failed:", err);
        });
    }
  }, [location]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold">Thank you for your payment!</h2>
      <p className="text-lg mt-4">We are verifying your payment...</p>
    </div>
  );
};

export default SuccessPage;
