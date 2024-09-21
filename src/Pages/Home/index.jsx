import React from "react";
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

const HomePage = () => {
  return (
    <div className="w-full px-8 lg:px-60 mx-auto bg-star">
      <h1 className="text-2xl font-extrabold py-4 max-w-6xl text-white ">
        Select a Game
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card sx={{ bgcolor: "transparent" }}>
          <div>
            <Typography
              level="title-lg"
              sx={{ color: "orangered", fontSize: "21px" }}
            >
              Tic Tac Toe
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
              <Typography
                level="body-sm"
                fontSize={12}
                sx={{ color: "white", opacity: "0.7" }}
              >
                Connect 3 same symbol to win
              </Typography>
            </Box>
          </div>
          <AspectRatio ratio="1/1">
            <img src={Tic_Tac_Img} loading="lazy" alt="" />
          </AspectRatio>
          <Link to="/Tic_Tac_Toe">
            <Button color="neutral" sx={{ width: "100%" }}>
              Play
            </Button>
          </Link>
        </Card>
        <Card sx={{ bgcolor: "transparent" }}>
          <div>
            <Typography
              level="title-lg"
              sx={{ color: "orangered", fontSize: "21px" }}
            >
              Connect 4
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
              <Typography
                level="body-sm"
                fontSize={12}
                sx={{ color: "white", opacity: "0.7" }}
              >
                Connect 4 same color to win
              </Typography>
            </Box>
          </div>
          <AspectRatio ratio="1/1">
            <img src={Connect4_Img} loading="lazy" alt="" />
          </AspectRatio>
          <Link to="/ConnectFour">
            <Button color="neutral" sx={{ width: "100%" }}>
              Play
            </Button>
          </Link>
        </Card>
        <Card sx={{ bgcolor: "transparent" }}>
          <div>
            <Typography
              level="title-lg"
              sx={{ color: "orangered", fontSize: "21px" }}
            >
              MineField
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
              <Typography
                level="body-sm"
                fontSize={12}
                sx={{ color: "white", opacity: "0.7" }}
              >
                BOOM BOOM
              </Typography>
            </Box>
          </div>
          <AspectRatio ratio="1/1">
            <img src={MineField_Img} loading="lazy" alt="" />
          </AspectRatio>
          <Link to="/MineField">
            <Button color="neutral" sx={{ width: "100%" }}>
              Play
            </Button>
          </Link>
        </Card>
        <Card sx={{ bgcolor: "transparent" }}>
          <div>
            <Typography
              level="title-lg"
              sx={{ color: "orangered", fontSize: "21px" }}
            >
              Sudoku
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
              <Typography
                level="body-sm"
                fontSize={12}
                sx={{ color: "white", opacity: "0.7" }}
              >
                9 x 9 Sudoku
              </Typography>
            </Box>
          </div>
          <AspectRatio ratio="1/1">
            <img src={Sudoku_Img} loading="lazy" alt="" />
          </AspectRatio>
          <Link to="/Sudoku">
            <Button color="neutral" sx={{ width: "100%" }}>
              Play
            </Button>
          </Link>
        </Card>
        <Card sx={{ bgcolor: "transparent" }}>
          <div>
            <Typography
              level="title-lg"
              sx={{ color: "orangered", fontSize: "21px" }}
            >
              Click Test
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
              <Typography
                level="body-sm"
                fontSize={12}
                sx={{ color: "white", opacity: "0.7" }}
              >
                Speed test
              </Typography>
            </Box>
          </div>
          <AspectRatio ratio="1/1">
            <img src={Click_Img} loading="lazy" alt="" />
          </AspectRatio>
          <Link to="/Click">
            <Button color="neutral" sx={{ width: "100%" }}>
              Play
            </Button>
          </Link>
        </Card>
        <Card sx={{ bgcolor: "transparent" }}>
          <div>
            <Typography
              level="title-lg"
              sx={{ color: "orangered", fontSize: "19px" }}
            >
              Password
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
              <Typography
                level="body-sm"
                fontSize={12}
                //mobile text size decreses
                sx={{ color: "white", opacity: "0.7"}}
              >
                Generates Password
              </Typography>
            </Box>
          </div>
          <AspectRatio ratio="1/1">
            <img src={PasswordGen_Img} loading="lazy" alt="" />
          </AspectRatio>
          <Link to="/PasswordGen">
            <Button color="neutral" sx={{ width: "100%" }}>
              Play
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
