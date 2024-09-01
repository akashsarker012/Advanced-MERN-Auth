import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Eye, EyeOff, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  console.log(token);
  

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/validate-token`,{
            params: { token },
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        console.log(response);
        if (response.data.success === !true) {
          navigate("/sing-in");
        }
      } catch (error) {
        
      }
    }

    verifyToken();
  }, [token, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/reset-password/${token}`,
        {
          token,
          password,
        }
      );

      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              required
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <Eye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer text-green-600 right-3 top-5 -translate-y-1/2"
                size={18}
              />
            ) : (
              <EyeOff
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer text-green-600 right-3 top-5 -translate-y-1/2"
                size={18}
              />
            )}
          </div>

          <div className="relative">
            <Input
              required
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {showPassword ? (
              <Eye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer text-green-600 right-3 top-5 -translate-y-1/2"
                size={18}
              />
            ) : (
              <EyeOff
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer text-green-600 right-3 top-5 -translate-y-1/2"
                size={18}
              />
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
          >
            Set New Password
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
