import React, { useState, useEffect } from "react";
import { AppBar, Typography, Toolbar, Avatar, Button, Stack, Grid } from "@mui/material";
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

  const balance = useSelector((state) => state.ledger.balance);

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
    <AppBar sx={styles.appBar} position="static" color="inherit">
      <Grid container direction="row" spacing={5} alignItems="center" justifyContent="space-between" sx={{ maxWidth: '100%' }}>
        <Grid item xs={12} md={6} l={3} xl={6} sx={{ maxWidth: '100%' }}>
          <Typography
            component={Link}
            className="gamblin-jack-font"
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
            align="center" className="miltonian-regular">
            Coin Toss Casino
          </Typography>
          <Typography align="center" variant="subtitle1" sx={{ color: "white", }} align="center" className="miltonian-regular">
            "Even a broken clock is right twice a day"
          </Typography>
        </Grid>
        <Grid item xs={12} md={2} xl={2} sx={{ display: 'flex', justifyContent: 'center' }} >
          {user !== "null" && user !== null ? (
            <Stack justifyContent={"center"} direction="column">
              <Typography className="gamblin-jack-font" sx={{ ...styles.userName, color: 'white' }} variant="h6">
                {user.name}
              </Typography>
              <Button
                variant="contained"
                className="miltonian-regular"
                sx={styles.logout}
                color="secondary"
                onClick={logout}
              >
                Logout
              </Button>
            </Stack>
          ) : <></>}
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Navbar;
