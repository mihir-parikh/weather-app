import Link from "next/link";

export interface WeatherInfo {
  main: {
    temp: number;
  };
  weather: [{ description: string }];
}

export default function Home({ weatherInfo, city }: { weatherInfo: WeatherInfo, city: string }) {
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
                {Math.round(weatherInfo.main.temp)}
              </h2>
              <sup>°C</sup>
              <p className="text-info text-capitalize">
                {weatherInfo.weather[0].description}
              </p>
            </div>
            <div><img src='/1.png' alt="" width={100} draggable="false" /></div>
          </div>
          <hr />
          <div className="d-md-flex justify-content-between align-items-center mt-4">
            <button className="btn btn-success border-0 save-btn px-4 py-3">
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
  const city = ipData.regionName;
  const lat = ipData.lat;
  const lon = ipData.lon;
  
  const api_key = process.env.OPEN_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const weatherRequest = await fetch(url);
  const weatherInfo = await weatherRequest.json();
  
  return { props: { weatherInfo, city } };
}

export function getToday(): string {
  let todayObj = new Date();
  let dd = String(todayObj.getDate()).padStart(2, '0');
  let mm = String(todayObj.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = todayObj.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
}