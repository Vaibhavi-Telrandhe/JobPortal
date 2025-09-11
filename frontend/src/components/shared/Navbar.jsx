import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // ADDED: Import useDispatch
import { logout } from "@/redux/authSlice"; // ADDED: Import logout action
import { useNavigate } from "react-router-dom"; // ADDED: Import useNavigate
import { toast } from "sonner"; // ADDED: Import toast

const Navbar = () => {
  // FIXED: Get user from Redux store instead of hardcoded false
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ADDED: Logout handler
  const logoutHandler = async () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          Job<span className="text-[#F83002]">Portal</span>
        </h1>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li className="cursor-pointer hover:text-[#F83002] transition">
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li className="cursor-pointer hover:text-[#F83002] transition">
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li className="cursor-pointer hover:text-[#F83002] transition">
                  <Link to="/">Home</Link>
                </li>
                <li className="cursor-pointer hover:text-[#F83002] transition">
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li className="cursor-pointer hover:text-[#F83002] transition">
                  <Link to="/browse">Browse</Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              {" "}
              {/* FIXED: Changed "item-center" to "items-center" */}
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6a38c2] hover:bg-[#5b30a6]">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                    alt={user?.fullname || "User"}
                  />
                  <AvatarFallback>
                    {user?.fullname?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      alt={user?.fullname || "User"}
                    />
                    <AvatarFallback>{user?.fullname || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname || "User"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio || "Welcome to Job Portal"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 text-gray-600">
                  {user && user.role === "student" && (
                    <div className="flex items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 cursor-pointer">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
