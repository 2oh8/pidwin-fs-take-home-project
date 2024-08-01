import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as messages from "../../messages";
import moment from "moment";

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Skeleton,
  Grid,
  Typography,
  Stack,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Fab
} from "@mui/material";

import Input from "../Login/Input";
import { wager } from "../../actions/wager";
import { styles } from "./styles";

import { getLedgerBalance, getLedgerEntries, getLeaderboard } from "../../actions/ledger";
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Example breakpoint for mobile

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [formData, setFormData] = useState(formDataInitVal);
  const [showGiphy, setShowGiphy] = useState(false);

  const history = useNavigate();

  const user = localStorage.getItem("profile")
    ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
    : "null";

  const balance = useSelector((state) => state.ledger.balance);
  const entries = useSelector((state) => state.ledger.entries);
  const leaderBoard = useSelector((state) => state.ledger.leaderBoard)

  const imageSizeSelector = isMobile ? 'fixed_width' : 'original'

  const giphy = useSelector((state) => state?.giphy?.coinToss?.images?.[imageSizeSelector]?.url);
  const giphy2 = useSelector((state) => state?.giphy?.coinToss?.images);
  console.log(giphy2)

  const toggleGiphyImageVisibility = async () => {
    setShowGiphy(!showGiphy)
    await new Promise(resolve => setTimeout(resolve, 5000))
    setShowGiphy(false)
  }

  useEffect(() => {
    const entry = entries?.[0]
    const message = `${entry?.type === 'credit' ? '+' : '-'}${Math.abs(entry?.amount)} ${entry?.description}`
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
    const GIPHY_APPEAR_MS_BUFFER = 1500
    e.preventDefault();
    await dispatch(getCoinTossGiphy());
    setShowGiphy(true)
    slotPull.play()
    await toggleGiphyImageVisibility
    await dispatch(wager(formData));
    await dispatch(getLedgerBalance());
    await new Promise(resolve => setTimeout(resolve, GIPHY_APPEAR_MS_BUFFER))
    await dispatch(getLeaderboard());
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
        dispatch(getLeaderboard());
      }
    } else {
      history("/auth");
    }
  }, [dispatch, user]);

  const renderSkeletonStack = (skeletonQuantity) => (
    <Stack sx={{ width: '100' }} justifyContent="center" direction="column">
      {Array(skeletonQuantity).fill('item').map((item) => (
        <Typography key={`skeleton-${Math.random()}`} sx={{ width: "100%" }} variant={isMobile ? "h1" : "h1"}>
          <Skeleton />
        </Typography>
      ))}
    </Stack>
  )

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3}>
          <Stack sx={{ p: 0 }} direction={'column'}>
            {!isMobile &&
              <Typography variant="h3" className="honk">
                Top Ten High Rollers
              </Typography>
            }
            {!showGiphy && <div style={{height: isMobile ? null : "700px", paddingBottom: isMobile ? null : "100px", overflowY: 'scroll'}}>
              {isMobile ?
                (<Card className="animate__flipInX" variant="outlined" sx={{ mt: 2 }}>
                  <Stack justifyContent="center" direction="row">
                    <Typography variant="h3" className="honk">
                      Top Ten High Rollers
                    </Typography>
                  </Stack>
                  <CardContent sx={{maxHeight: "100", overflowY: "scroll"}}>
                    {leaderBoard?.map(({ userName, ledgerBalance }, index) => (
                      <Stack justifyContent="space-between" key={`${userName}`} direction="row">
                        <Typography className="honk" variant="h5" component="div">
                          {index + 1}. {userName}
                        </Typography>
                        <Typography className="honk" variant="h5" component="div">
                          {ledgerBalance}
                        </Typography>
                      </Stack>
                    ))}
                  </CardContent>
                </Card>
                ) : leaderBoard?.map(({ userName, ledgerBalance }, index) => (
                  <Card className="animate__flipInX" key={`${userName}`} variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                      <Stack justifyContent="space-between" key={`${userName}`} direction="row">
                        <Typography className="honk" variant="h5" component="div">
                          {index + 1}. {userName}
                        </Typography>
                        <Typography className="honk" variant="h5" component="div">
                          {ledgerBalance}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
            </div>
            }
            {showGiphy &&
              renderSkeletonStack(isMobile ? 1 : 5)
            }
          </Stack>
        </Grid>
        <Grid item xs={12} lg={6}>
          {!showGiphy &&
            <Stack direction="column" justifyContent={"center"}>
              <Typography alignSelf={"center"} sx={{ fontSize: isMobile ? 100 : 300 }} className="honk">
                {balance}
              </Typography>
              <form sx={styles.form} onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={isMobile ? 12 : 12} order="2">
                    <Input
                      type="number"
                      name="wagerAmount"
                      label="Wager Amount"
                      handleChange={handleChange}
                      autoFocus
                    />
                    <Button
                      type="submit"
                      sx={{ ...styles.purple, mt: 2 }}
                      className="playfair"
                      fullWidth
                      variant="contained"
                      disabled={formData.wagerAmount <= 0}
                    >
                      <Typography className="honk" variant="h3">
                        PLACE BET
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12} order="1">
                    <RadioGroup
                      aria-labelledby="selectedOutcome"
                      defaultValue="heads"
                      name="selectedOutcome"
                    >
                      <Stack sx={{width: "100"}} direction="row" justifyContent="center">
                        <FormControlLabel onChange={handleChange} value="heads" control={<Radio />} label={<Typography className="honk" variant="h2" color="white">Heads</Typography>} />
                        <FormControlLabel onChange={handleChange} value="tails" control={<Radio />} label={<Typography className="honk" variant="h2" color="white">Tails</Typography>} />
                      </Stack>
                    </RadioGroup>
                  </Grid>
                </Grid>
              </form>
            </Stack>
          }
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
        </Grid>
        <Grid item xs={12} lg={3} >
          <Stack direction={'column'}>
            <Typography variant="h3" className="honk">
              History
            </Typography>
            {!showGiphy &&
              <div style={{ maxHeight: "750px", overflowY: "scroll" }} >
                <>
                  {entries.map(({ type, amount, description, reason, multiplier, createdAt }) => (
                    <Card
                    className="animate__flipInX"
                      key={`${createdAt}`}
                      sx={{
                        width: "20",
                        height: "140",
                        mt: 2
                      }} variant="outlined">
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" >
                          <Typography sx={{ color: type === 'credit' ? '#00c853' : '#d50000' }} className="honk" variant="h3" >
                            {type === 'credit' ? '+' : '-'}{Math.abs(amount)}
                          </Typography>
                          {multiplier > 1 &&
                            <Typography sx={{ color: type === 'credit' ? '#00c853' : '#d50000' }} className="honk" variant="h3">
                              {multiplier}x
                            </Typography>
                          }
                        </Stack>
                        <Typography sx={{ mb: 1, color: type === 'credit' ? '#00c853' : '#d50000' }} className="grandstander" color="text.secondary">
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
                </>
              </div>
            }
            {showGiphy &&
              (renderSkeletonStack(isMobile ? 7 : 5))
            }
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
