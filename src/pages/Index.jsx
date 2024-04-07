import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Heading, keyframes } from "@chakra-ui/react";

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_SPEED = 5;
const BALL_SPEED = 3;

const Index = () => {
  const [player1Y, setPlayer1Y] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [player2Y, setPlayer2Y] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballX, setBallX] = useState(GAME_WIDTH / 2 - BALL_SIZE / 2);
  const [ballY, setBallY] = useState(GAME_HEIGHT / 2 - BALL_SIZE / 2);
  const [ballSpeedX, setBallSpeedX] = useState(BALL_SPEED);
  const [ballSpeedY, setBallSpeedY] = useState(BALL_SPEED);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const gameRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && player2Y > 0) {
        setPlayer2Y((prevY) => prevY - PADDLE_SPEED);
      } else if (e.key === "ArrowDown" && player2Y < GAME_HEIGHT - PADDLE_HEIGHT) {
        setPlayer2Y((prevY) => prevY + PADDLE_SPEED);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [player2Y]);

  useEffect(() => {
    if (!gameStarted) return;

    const moveBall = () => {
      setBallX((prevX) => prevX + ballSpeedX);
      setBallY((prevY) => prevY + ballSpeedY);
    };

    const detectCollision = () => {
      if (ballY <= 0 || ballY >= GAME_HEIGHT - BALL_SIZE) {
        setBallSpeedY((prevSpeed) => -prevSpeed);
      }

      if ((ballX <= PADDLE_WIDTH && ballY >= player1Y && ballY <= player1Y + PADDLE_HEIGHT) || (ballX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && ballY >= player2Y && ballY <= player2Y + PADDLE_HEIGHT)) {
        setBallSpeedX((prevSpeed) => -prevSpeed);
      }

      if (ballX <= 0) {
        setPlayer2Score((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore === 5) {
            setGameEnded(true);
            setGameStarted(false);
          } else {
            resetBall();
          }
          return newScore;
        });
      } else if (ballX >= GAME_WIDTH - BALL_SIZE) {
        setPlayer1Score((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore === 5) {
            setGameEnded(true);
            setGameStarted(false);
          } else {
            resetBall();
          }
          return newScore;
        });
      }
    };

    const resetBall = () => {
      setBallX(GAME_WIDTH / 2 - BALL_SIZE / 2);
      setBallY(GAME_HEIGHT / 2 - BALL_SIZE / 2);
      setBallSpeedX((prevSpeed) => -prevSpeed);
    };

    const gameLoop = () => {
      moveBall();
      detectCollision();
    };

    const intervalId = setInterval(gameLoop, 16);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStarted, ballX, ballY, player1Y, player2Y, ballSpeedX, ballSpeedY]);

  useEffect(() => {
    const player1Move = () => {
      if (ballY < player1Y + PADDLE_HEIGHT / 2 && player1Y > 0) {
        setPlayer1Y((prevY) => prevY - PADDLE_SPEED);
      } else if (ballY > player1Y + PADDLE_HEIGHT / 2 && player1Y < GAME_HEIGHT - PADDLE_HEIGHT) {
        setPlayer1Y((prevY) => prevY + PADDLE_SPEED);
      }
    };

    if (gameStarted) {
      const intervalId = setInterval(player1Move, 16);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [gameStarted, ballY, player1Y]);

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
  };

  const resetGame = () => {
    setPlayer1Y(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setPlayer2Y(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setBallX(GAME_WIDTH / 2 - BALL_SIZE / 2);
    setBallY(GAME_HEIGHT / 2 - BALL_SIZE / 2);
    setBallSpeedX(BALL_SPEED);
    setBallSpeedY(BALL_SPEED);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setGameStarted(false);
    setGameEnded(false);
  };

  const bounce = keyframes`
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  `;

  const animation = `${bounce} 0.5s ease-in-out infinite`;

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading mb={8}>Pong Game</Heading>
      <Box ref={gameRef} w={GAME_WIDTH} h={GAME_HEIGHT} bg="gray.100" position="relative" overflow="hidden">
        <Box w={PADDLE_WIDTH} h={PADDLE_HEIGHT} bg="blue.500" position="absolute" left={0} top={player1Y} />
        <Box w={PADDLE_WIDTH} h={PADDLE_HEIGHT} bg="red.500" position="absolute" right={0} top={player2Y} />
        <Box w={BALL_SIZE} h={BALL_SIZE} bg="green.500" position="absolute" left={ballX} top={ballY} borderRadius="50%" animation={gameStarted ? animation : "none"} />
      </Box>
      <Flex mt={4} justify="space-between" w={GAME_WIDTH}>
        <Box>Player 1: {player1Score}</Box>
        <Box>Player 2: {player2Score}</Box>
      </Flex>
      {!gameStarted && !gameEnded && (
        <Button mt={8} onClick={startGame}>
          Start Game
        </Button>
      )}
      {gameEnded && (
        <Button mt={8} onClick={resetGame}>
          Restart Game
        </Button>
      )}
    </Flex>
  );
};

export default Index;
