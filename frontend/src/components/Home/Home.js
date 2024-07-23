import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as messages from "../../messages";
import moment from "moment";

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
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Box,
  Fab
} from "@mui/material";

import Input from "../Login/Input";
import { wager } from "../../actions/wager";
import { styles } from "./styles";

import { getLedgerBalance, getLedgerEntries } from "../../actions/ledger";
import { getCoinTossGiphy } from "../../actions/giphy";
import { useDispatch, useSelector } from "react-redux";

import HelpOutlineSharpIcon from '@mui/icons-material/HelpOutlineSharp';

const Home = () => {
  const formDataInitVal = {
    wagerAmount: 0,
    selectedOutcome: "heads"
  };

  const slotPull = new Audio("/slotpull.mp3")
  const win = new Audio("/win.wav")
  const coin = new Audio("/coin.wav")

  const [muteInteractives, setMuteInteractives] = useState(true);
  win.muted = muteInteractives;
  coin.muted = muteInteractives;

  const [formData, setFormData] = useState(formDataInitVal);
  const [showGiphy, setShowGiphy] = useState(false);

  const history = useNavigate();

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
    const message = `${entry?.type === 'credit' ? '+' : '-'}${entry?.amount} ${entry?.description}`
    if (entry) {
      if (entry.type === "credit") {
        try {  
          win.play()
        } catch (e) {
          // no-op
        }
        messages.success(message)
      } else {
        try {
          coin.play()
        } catch (e) {
          // no-op
        }
        messages.error(message)
      }
    }
  }, entries)

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    setMuteInteractives(false)
    const GIPHY_APPEAR_MS_BUFFER = 1500
    e.preventDefault();
    await dispatch(getCoinTossGiphy());
    setShowGiphy(true)
    slotPull.play()
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
    } else {
      history("/auth");
    }
  }, [dispatch, user]);

  return (
    <Grow in>
      <Container component="main" maxWidth="md">
        {showGiphy && <img style={{ width: "100%", maxHeight: "65vh" }} src={giphy} />}
        {showGiphy &&
          <Stack sx={{ pt: 8, width: '100' }} spacing={2} justifyContent="center" direction="row">
            <Box sx={{ m: 1, position: 'relative' }}>
              <Fab
                size="large"
                aria-label="save"
                color="primary"
              >
                <HelpOutlineSharpIcon />
              </Fab>
              {showGiphy && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: 'primary',
                    position: 'absolute',
                    top: -6,
                    left: -6,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Stack>
        }
        {!showGiphy && <Paper sx={{ backgroundColor: "black !important", color: "white" }} elevation={0}>
          <form sx={styles.form} onSubmit={handleSubmit}>
            <Stack sx={{ p: 1, width: '100' }} spacing={2} justifyContent="center" direction={"column"}>
              <Stack sx={{ p: 1, width: '100' }} direction="row" justifyContent="center">
                <Typography sx={{ fontSize: 100 }} alignSelf="center" className="honk">
                  {balance}
                </Typography>
                <Typography className="honk" sx={{ fontSize: 25, bottom: -70, right: -10, position: "relative" }}>cr</Typography>
              </Stack>
              <Input
                type="number"
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
                <FormControlLabel onChange={handleChange} value="heads" control={<Radio />} label={<Typography className="honk" variant="h2" color="white">Heads</Typography>} />
                <FormControlLabel onChange={handleChange} value="tails" control={<Radio />} label={<Typography className="honk" variant="h2" color="white">Tails</Typography>} />
              </RadioGroup>
              <Button
                type="submit"
                sx={styles.purple}
                className="playfair"
                fullWidth
                variant="contained"
              >
                <Typography className="honk" variant="h3">
                  PLACE BET
                </Typography>
              </Button>
            </Stack>
            <div style={{ width: "100%", maxHeight: "350px", overflowY: "scroll" }}>

              <Stack sx={{ p: 1 }} direction={'column'}>
                {entries.map(({ type, amount, description, reason, multiplier, createdAt }) => (
                  <Card sx={{ backgroundColor: type === 'credit' ? '#00c853' : '#d50000' }} variant="outlined" justifyContent="center" sx={{ mt: 4 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" >
                        <Typography sx={{ color: type === 'credit' ? '#00c853' : '#d50000' }} className="honk" variant="h1" component="div">
                          {type === 'credit' ? '+' : '-'}{Math.abs(amount)}
                        </Typography>
                        {multiplier > 1 &&
                          <Typography sx={{ color: type === 'credit' ? '#00c853' : '#d50000' }} className="honk" variant="h1" component="div">
                            {multiplier}x
                          </Typography>
                        }
                      </Stack>
                      <Typography sx={{ mb: 1.5, color: type === 'credit' ? '#00c853' : '#d50000' }} className="grandstander" color="text.secondary">
                        {reason}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" >
                      <Typography className="grandstander" variant="body2">
                        {description}
                      </Typography>
                      <Typography className="grandstander" variant="body2">
                        {moment(createdAt).fromNow()}
                      </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </div>
          </form>
        </Paper>
        }
      </Container>
    </Grow >
  );
};

export default Home;
