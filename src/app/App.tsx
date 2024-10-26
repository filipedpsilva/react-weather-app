import styled from "styled-components";

import "./App.css";
import { reactLogo } from "./assets";
import { WeatherPage } from "./pages";

function App(): JSX.Element {
  const Header = styled.div`
    display: flex;
    flex-direction: row;
    height: 20vh;
    align-items: center;
    justify-content: center;
  `;

  const Footer = styled.footer`
    display: flex;
    flex-direction: row;
    height: 5vh;
    align-items: center;
    justify-content: center;
  `;

  return (
    <>
      <Header>
        <h1>React Weather App</h1>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </Header>
      <WeatherPage />
      <Footer>{`Filipe Silva ${new Date().getFullYear()}`}</Footer>
    </>
  );
}

export default App;
