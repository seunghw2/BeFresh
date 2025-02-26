import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ProgressBar from "../atoms/progerssBar";
import FoodModal from "../../pages/modal";
import sampleimg from "../../assets/sampleimg.png";
import { FoodData, FoodTypes } from "../../types/foodTypes";
import { deleteFood } from "../../api/food/foodCardApi";
import styled from "styled-components";

interface CardFormProps {
  foodData: FoodData;
  cardApiData: FoodTypes[];
  setData: React.Dispatch<React.SetStateAction<FoodTypes[]>>;
  onDelete: (id: number) => void;
}

export default function ImgMediaCard({
  foodData,
  setData,
  cardApiData,
  onDelete,
}: Readonly<CardFormProps>) {
  const { id, name, image, freshState, ftype, refresh } = foodData;

  const newimage = image != null ? image.replace(/\\/g, "") : sampleimg;
  const regDttmDate = new Date(foodData.regDttm);
  const formattedRegDttm = `${regDttmDate.getFullYear() % 100}년 ${
    regDttmDate.getMonth() + 1
  }월 ${regDttmDate.getDate()}일`;

  const handleDelete = async () => {
    try {
      await deleteFood(id);
      onDelete(id);
    } catch (error) {
      console.error("음식 삭제 중 오류 발생:", error);
    }
  };
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("에러이미지");
    e.currentTarget.src = sampleimg;
  };
  const SensorText = styled.span`
    color: lime;
    border: 1px solid lime;
    padding: 1px 3px;
    border-radius: 2px;
    font-size: 0.8rem;
    margin-Left: 2vw;
  `;

  const GoneText = styled.span`
    color: #ff9999;
    border: 1px solid #ff9999;
    padding: 1px 3px;
    border-radius: 2px;
    font-size: 0.8rem;
    margin-Left: 2vw;
  `;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt={name}
        height="200"
        image={newimage ?? sampleimg}
        onError={handleImageError}
        sx={{
          filter:
            freshState === 0
              ? "brightness(70%) opacity(.7) drop-shadow(0 0 0 red)"
              : "none",
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
          {ftype === "용기" && refresh === "데이터없음" ? (
            <GoneText>측정 중단</GoneText>
          ) : (
            ftype === "용기" && <SensorText>측정중</SensorText>
          )}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "smaller" }}
        >
          {`${formattedRegDttm}부터 보관중`}
        </Typography>
        <ProgressBar value={foodData.freshState} />
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ marginTop: "10px" }}
        >
          {`${foodData.elapsedTime}일 경과`}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <FoodModal
          foodData={foodData}
          cardApiData={cardApiData}
          setData={setData}
        />
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          sx={{ fontWeight: "bold" }}
        >
          음식 삭제
        </Button>
      </CardActions>
    </Card>
  );
}
