import { Link } from "react-router-dom";

import Tic_Tac_Img from "../../assets/tictac.png";
import MineField_Img from "../../assets/minefield.png";
import Sudoku_Img from "../../assets/sudoku.png";
import Click_Img from "../../assets/click.png";
import PasswordGen_Img from "../../assets/pass.png";
import Connect4_Img from "../../assets/connect4.jpg";

import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { Box, Button } from "@mui/joy";

const glassCardSx = {
  bgcolor: "rgba(255,255,255,0.15)",
  border: "1px solid rgba(255,255,255,0.30)",
  backdropFilter: "blur(20px) saturate(150%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.45), 0 10px 30px rgba(0,0,0,0.25)",
  borderRadius: "24px",
  p: 1.5,
  position: "relative",
  overflow: "hidden",
  transition: "transform .18s ease, box-shadow .18s ease, background .18s ease",
  "&:hover": {
    transform: "translateY(-2px) scale(1.01)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.55), 0 16px 40px rgba(0,0,0,0.35)",
    bgcolor: "rgba(255,255,255,0.18)",
  },
  // subtle inner ring
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "24px",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
    pointerEvents: "none",
  },
};

const glassBtnSx = {
  width: "100%",
  bgcolor: "rgba(255,255,255,0.22)",
  color: "#0f172a",
  border: "1px solid rgba(255,255,255,0.45)",
  backdropFilter: "blur(10px)",
  fontWeight: 700,
  "&:hover": {
    bgcolor: "rgba(255,255,255,0.3)",
  },
};

const titleSx = {
  color: "transparent",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: 0.2,
};

const subSx = { color: "rgba(255,255,255,0.8)", fontSize: 12 };

const glareSx = {
  position: "absolute",
  top: -24,
  left: 24,
  width: 140,
  height: 140,
  borderRadius: "9999px",
  bgcolor: "rgba(255,255,255,0.28)",
  filter: "blur(36px)",
  pointerEvents: "none",
};

const imgSx = {
  borderRadius: "16px",
  overflow: "hidden",
};

const GAMES = [
  {
    key: "tictactoe",
    title: "Tic Tac Toe",
    desc: "Connect 3 same symbol to win",
    img: Tic_Tac_Img,
    to: "/tictactoe",
  },
  {
    key: "connect4",
    title: "Connect 4",
    desc: "Connect 4 same color to win",
    img: Connect4_Img,
    to: "/connectfour",
  },
  {
    key: "minefield",
    title: "MineField",
    desc: "BOOM BOOM",
    img: MineField_Img,
    to: "/minefield",
  },
  {
    key: "sudoku",
    title: "Sudoku",
    desc: "9 × 9 Sudoku",
    img: Sudoku_Img,
    to: "/sudoku",
  },
  {
    key: "click",
    title: "Click Test",
    desc: "Speed test",
    img: Click_Img,
    to: "/click",
  },
  // {
  //   key: "password",
  //   title: "Password",
  //   desc: "Generates Password",
  //   img: PasswordGen_Img,
  //   to: "/passwordgen",
  // },
];

function GameCard({ title, desc, img, to }) {
  return (
    <Card
      component={Link}
      to={to}
      sx={{ ...glassCardSx, textDecoration: "none" }}
    >
      {/* glare highlight */}
      <Box sx={glareSx} />
      <Box sx={{ display: "grid", gap: 1.2 }}>
        <Box>
          <Typography level="title-lg" sx={titleSx}>
            {title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}>
            <Typography level="body-sm" sx={subSx}>
              {desc}
            </Typography>
          </Box>
        </Box>

        <AspectRatio ratio="1/1" sx={imgSx}>
          <img src={img} loading="lazy" alt={title} />
        </AspectRatio>

        <Button variant="soft" color="neutral" sx={glassBtnSx}>
          Play
        </Button>
      </Box>
    </Card>
  );
}

const HomePage = () => {
  return (
    <div className="w-full  mx-auto bg-star">
      <div className="max-w-7xl px-4 md:px-6 mx-auto ">
        <h1 className="text-2xl md:text-3xl font-extrabold py-5 max-w-6xl text-white">
          Select a Game
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {GAMES.map((g) => (
            <GameCard key={g.key} {...g} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
