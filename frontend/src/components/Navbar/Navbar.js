import React, { useState, useEffect } from "react";
import { AppBar, Typography, Toolbar, Avatar, Button, Stack, Chip } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import * as actionType from "../../constants/actionTypes";
import { styles } from "./styles";

const Navbar = () => {
  const [user, setUser] = useState(
    localStorage.getItem("profile")
      ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
      : "null"
  );

  const dispatch = useDispatch();
  let location = useLocation();
  const history = useNavigate();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    history("/auth");
    setUser("null");
  };

  useEffect(() => {
    if (user !== "null" && user !== null) {
      if (user.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(
      localStorage.getItem("profile")
        ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
        : "null"
    );
  }, [location]);

  return (
    <AppBar sx={styles.appBar} position="static">
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Typography
          component={Link}
          className="honk"
          to="/"
          sx={{ ...styles.heading, whiteSpace: 'nowrap', color: "white" }}
          variant="h1"
          align="left"
        >
          Gamblin' Jack's
        </Typography>
        <Typography variant="h3"
          sx={{
            p: 1,
            color: "white",
            whiteSpace: 'nowrap',
          }}
          align="center" className="honk">
          Coin Toss Casino
        </Typography>
        <Chip className="grandstander" label={'"Even a broken clock is right twice a day"'} color="primary" />
        {/* <Typography variant="subtitle1" color="primary" align="center" className="grandstander">
          "Even a broken clock is right twice a day"
        </Typography> */}
        {user !== "null" && user !== null ? (
          <Stack justifyContent={"center"} direction="column">
            <Typography className="honk" sx={{ ...styles.userName, color: 'white', mt: 2 }} variant="h4">
              {user.name}
            </Typography>
            <Button
              variant="text"
              className="honk"
              size="large"
              sx={styles.logout}
              color="error"
              onClick={logout}
            >
              Log out
            </Button>
          </Stack>
        ) : <></>}
      </Stack>
    </AppBar>
  );
};

export default Navbar;
