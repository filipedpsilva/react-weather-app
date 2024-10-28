import styled from "styled-components";

import "./App.css";
import { reactLogo } from "./assets";
import { WeatherPage } from "./pages";
import { DEVICE_SIZES } from "./data/constants";

// #region Styling

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.tablet}) {
    max-width: 90vw;
    flex-direction: column;
  }

  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }

  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  .logo.react:hover {
    filter: drop-shadow(0 0 2em #61dafbaa);
  }

  @keyframes logo-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .logo {
      animation: logo-spin infinite 20s linear;
    }
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  height: 5vh;
  align-items: center;
  justify-content: center;
`;

// #endregion Styling

function App(): JSX.Element {
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
