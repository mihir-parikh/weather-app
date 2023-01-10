import Link from "next/link";

//  Type for data coming from the external API
export interface WeatherInfo {
  main: {
    temp: number;
  };
  weather: [
    {
      description: string,
      icon: string,
    }
  ];
}

//  Type for the internal Weather History data
export interface WeatherHistoryData {
  date: string,
  time: string,
  city: string,
  temperature: number,
  description: string
}

export default function Home({ weatherInfo, city }: { weatherInfo: WeatherInfo, city: string }) {
  const saveWeather = () => {
    const date = new Date();

    let data: WeatherHistoryData = {
      date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      time: date.toLocaleTimeString(),
      city: city,
      temperature: weatherInfo.main.temp,
      description: weatherInfo.weather[0].description
    };

    let previousData = [];
    let previousDataStr: string | null = localStorage.getItem("weatherHistory");
    if (previousDataStr !== null) {
      previousData = JSON.parse(previousDataStr);
    }
    previousData.push(data);
    localStorage.setItem("weatherHistory", JSON.stringify(previousData));
    alert('Weather saved successfully!');
  }

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div>
          <div>
            <h1 className="fw-bolder" style={{ fontSize: "60px" }}>
              {city}
            </h1>
            {getToday()}
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="pe-5">
              <h2 className="d-inline">
                {weatherInfo.main.temp}
              </h2>
              <sup>°</sup>
              <p className="text-info text-capitalize">
                {weatherInfo.weather[0].description}
              </p>
            </div>
            <div><img src={`http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`} alt="" width={100} draggable="false" /></div>
          </div>
          <hr />
          <div className="d-md-flex justify-content-between align-items-center mt-4">
            <button className="btn btn-success border-0 save-btn px-4 py-3" onClick={saveWeather}>
              Timestamp
            </button>
            <Link href="/history">
              <button className="btn btn-danger border-0 history-btn px-4 py-3 ms-auto">
                My History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const ipRequest = await fetch('http://ip-api.com/json');
  const ipData = await ipRequest.json();
  const city: string = ipData.city + ', ' + ipData.region;
  const lat: string = ipData.lat;
  const lon: string = ipData.lon;

  const api_key: string | undefined = process.env.OPEN_WEATHER_API_KEY;
  const url: string = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const weatherRequest = await fetch(url);
  const weatherInfo = await weatherRequest.json();

  return { props: { weatherInfo, city } };
}

export function getToday(): string {
  let todayObj: Date = new Date();
  let dd: string = String(todayObj.getDate()).padStart(2, '0');
  let mm: string = String(todayObj.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy: number = todayObj.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
}