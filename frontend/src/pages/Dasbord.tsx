import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import CustomButton from "../components/common/CustomButton";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box>
     
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#fafafa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          border: "1px solid #ddd",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            
               Welcome to your Dashboard
             
          </Typography>
          <Typography variant="body2" fontWeight={500} mt={0.5}>
            {user?.email} - {user?.role}
          </Typography>
        </Box>

        <CustomButton
          label="LOGOUT"
          color="error"
          onClick={handleLogout}
          sx={{
            fontWeight: 600,
            color: "#fff",
            padding:'6px 20px'
          }}
        />
      </Box>

     
      <Box mt={3}>
        <ExpenseList />
      </Box>

      <Box mt={4}>
        <ExpenseChart />
      </Box>
    </Box>
  );
};

export default Dashboard;
