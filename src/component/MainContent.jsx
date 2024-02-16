import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
} from "@mui/material";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import Prayer from "./Prayer";

import "moment/dist/locale/ar-sa";
moment.locale("ar-sa");
export default function MainContent() {
  // STATES
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [timings, setTimings] = useState({
    Fajr: "04:20",
    Dhuhr: "11:50",
    Asr: "15:18",
    Maghrib: "18:03",
    Isha: "19:33",
  });

  const [remainingTime, setRemainingTime] = useState();

  const [city, setCity] = useState({
    displayName: "القاهرة",
    apiName: "Cairo",
    country: "EG",
    continent: "Africa",
    apiTime: "Cairo",
  });

  const [today, setToday] = useState("");

  const avilableCities = [
    {
      displayName: "القاهرة",
      apiName: "Cairo",
      country: "EG",
      continent: "Africa",
      apiTime: "Cairo",
    },
    {
      displayName: "القدس",
      apiName: "Jerusalem",
      country: "IL",
      continent: "Asia",
      apiTime: "Jerusalem",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
      country: "SA",
      continent: "Asia",
      apiTime: "Riyadh",
    },
    {
      displayName: "أبو ظبي",
      apiName: "Abu Dhabi",
      country: "AE",
      continent: "Asia",
      apiTime: "Dubai",
    },
    {
      displayName: "بغداد",
      apiName: "Baghdad",
      country: "IQ",
      continent: "Asia",
      apiTime: "Baghdad",
    },
    {
      displayName: "الدار البيضاء",
      apiName: "Casablanca",
      country: "MA",
      continent: "Africa",
      apiTime: "Casablanca",
    },
    {
      displayName: "دمشق",
      apiName: "Damascus",
      country: "SY",
      continent: "Asia",
      apiTime: "Damascus",
    },
    {
      displayName: "طرابلس",
      apiName: "Tripoli",
      country: "LY",
      continent: "Africa",
      apiTime: "Tripoli",
    },
    {
      displayName: "تونس",
      apiName: "Tunisia",
      country: "TN",
      continent: "Africa",
      apiTime: "Tunis",
    },
    {
      displayName: "الدوحة",
      apiName: "Doha",
      country: "QA",
      continent: "Asia",
      apiTime: "Qatar",
    },
  ];

  const prayersArray = [
    {
      key: "Fajr",
      displayName: "الفجر",
    },
    {
      key: "Dhuhr",
      displayName: "الظهر",
    },
    {
      key: "Asr",
      displayName: "العصر",
    },
    {
      key: "Maghrib",
      displayName: "المغرب",
    },
    {
      key: "Isha",
      displayName: "العشاء",
    },
  ];

  const getTiming = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/15-02-2024?city=${city.apiName}&country=${city.country}&method=4`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTiming();
  }, [city]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    let jun = moment().tz(`${city.continent}/${city.apiTime}`);
    setToday(jun.format("YYYY-MM-DD | a h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment().tz(`${city.continent}/${city.apiTime}`);

    let prayerIndex = null;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else if (momentNow.isAfter(moment(timings["Isha"], "hh:mm"))) {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);
    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00.00.00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    let valueTotalTime = `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`;

    setRemainingTime(valueTotalTime);
  };

  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((x) => {
      return x.apiName === event.target.value;
    });
    setCity(cityObject);
  };

  return (
    <>
      {/* START TOP ROW */}
      <Grid container>
        <Grid xs={12} sm={6}>
          <h2>{today}</h2>
          <h1>{city.displayName}</h1>
        </Grid>

        <Grid xs={12} sm={6}>
          <h2>متبقي حتي صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
          <h1>{remainingTime}</h1>
        </Grid>
      </Grid>
      {/* END TOP ROW */}
      <Divider style={{ borderColor: "#fff", opacity: "0.1" }} />
      {/* SATRT PRAYERS CARDS */}
      <Stack
        direction={"row"}
        justifyContent={"space-around"}
        style={{ marginTop: "50px", flexWrap: "wrap" }}
      >
        <Prayer
          name="الفجر"
          time={timings.Fajr}
          image="https://i.pinimg.com/474x/42/82/72/4282728a23014f65111b84bc7ef4983a.jpg"
        />
        <Prayer
          name="الظهر"
          time={timings.Dhuhr}
          image="https://i.pinimg.com/474x/cb/d3/8f/cbd38ffa20f9afccd718643ae07d8291.jpg"
        />
        <Prayer
          name="العصر"
          time={timings.Asr}
          image="https://i.pinimg.com/474x/81/ba/ab/81baab42b844c8a30ba7ec6f267c8d9c.jpg"
        />
        <Prayer
          name="المغرب"
          time={timings.Maghrib}
          image="https://i.pinimg.com/474x/52/ec/f5/52ecf509febd46c909dd4eb7dc3df068.jpg"
        />
        <Prayer
          name="العشاء"
          time={timings.Isha}
          image="https://i.pinimg.com/474x/9f/40/80/9f40803fd20d2521d9ca56aba158982c.jpg"
        />
      </Stack>
      {/* END PRAYERS CARDS */}
      {/* START Select CITY */}
      <Stack
        direction={"row"}
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "40%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "#fff" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "#fff" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={city.apiName}
            label="City"
            onChange={handleCityChange}
          >
            {avilableCities.map((city, index) => {
              return (
                <MenuItem key={index} value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      {/* END Select CITY */}
    </>
  );
}
