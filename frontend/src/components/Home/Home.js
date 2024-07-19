import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as messages from "../../messages";

import {
  Grow,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

import Input from "../Login/Input";
import { wager } from "../../actions/wager";
import { styles } from "./styles";

import { getLedgerBalance, getLedgerEntries } from "../../actions/ledger";
import { getCoinTossGiphy } from "../../actions/giphy";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const formDataInitVal = {
    wagerAmount: 0,
    selectedOutcome: "heads"
  };

  const [formData, setFormData] = useState(formDataInitVal);
  const [showGiphy, setShowGiphy] = useState(false);

  const user = localStorage.getItem("profile")
    ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
    : "null";

  const balance = useSelector((state) => state.ledger.balance);
  const entries = useSelector((state) => state.ledger.entries);
  const giphy = useSelector((state) => state?.giphy?.coinToss?.images?.original?.url);

  const toggleGiphyImageVisibility = async () => {
    setShowGiphy(!showGiphy)
    await new Promise(resolve => setTimeout(resolve, 5000))
    setShowGiphy(false)
  }

  useEffect(() => {
    const entry = entries?.[0]
    const message = `${entry.type === 'credit' ? '+' : '-'}${entry.amount} ${entry.description}`
    if (entry) {
      if (entry.type === "credit") {
        messages.success(message)
      } else {
        messages.error(message)
      }
    }
  }, entries)

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    const GIPHY_APPEAR_MS_BUFFER = 1500
    e.preventDefault();
    await dispatch(getCoinTossGiphy());
    setShowGiphy(true)
    await toggleGiphyImageVisibility
    await dispatch(wager(formData));
    await dispatch(getLedgerBalance());
    await new Promise(resolve => setTimeout(resolve, GIPHY_APPEAR_MS_BUFFER))
    await dispatch(getLedgerEntries());
    setShowGiphy(false)
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user && user._id) {
      if (!balance) {
        dispatch(getLedgerBalance());
        dispatch(getLedgerEntries());
      }
    }
  }, [dispatch, user]);

  return (
    <Grow in>
      <Container component="main" maxWidth="md">
        {showGiphy && <img style={{ width: "100%", maxHeight: "65vh" }} src={giphy} />}
        {!showGiphy && <Paper sx={{ mt: 3, backgroundColor: "black !important", color: "white" }} elevation={0}>
          <form sx={styles.form} onSubmit={handleSubmit}>
            <Stack sx={{ p: 1, width: '100' }} spacing={2} justifyContent="center" direction={"column"}>
              <Typography alignSelf="center" className="bungee-shade-regular" variant="h1">
                {balance}
              </Typography>
              <Input
                type="number"
                InputProps={{
                  classes: {
                    input: { color: "white" }
                  }
                }}
                fontColor="white"
                name="wagerAmount"
                label="Wager Amount"
                handleChange={handleChange}
                autoFocus
                half
              />
              <RadioGroup
                aria-labelledby="selectedOutcome"
                defaultValue="heads"
                name="selectedOutcome"
              >
                <FormControlLabel onChange={handleChange} value="heads" control={<Radio />} label="Heads" />
                <FormControlLabel onChange={handleChange} value="tails" control={<Radio />} label="Tails" />
              </RadioGroup>
              <Button
                type="submit"
                sx={styles.purple}
                className="playfair"
                fullWidth
                variant="contained"
              >
                <Typography className="miltonian-regular" variant="h3">
                  PLACE BET
                </Typography>
              </Button>
            </Stack>
            <Stack sx={{ p: 1 }} direction={'column'}>
              {entries.map(({ type, amount, description, reason, multiplier }) => (
                <Paper className="bungee-shade-regular" elevation={0} sx={{ mt: 3, fontSize: 25, backgroundColor: "transparent", color: type === 'credit' ? '#00c853' : '#d50000' }}>{type === 'credit' ? '+' : '-'}{amount} {description ? description : reason} {multiplier > 1 ? `(${multiplier}x Bonus Win)` : ''}</Paper>
              ))}
            </Stack>
          </form>
        </Paper>
        }
      </Container>
    </Grow >
  );
};

export default Home;
