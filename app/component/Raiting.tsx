"use client";
import * as React from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { useParams } from "next/navigation";

const labels: { [key: number]: string } = {
  0.5: "غير مفيد",
  1: "غير مفيد+",
  1.5: "ضعيف",
  2: "ضعيف+",
  2.5: "مقبول",
  3: "مقبول+",
  3.5: "جيد",
  4: "جيد+",
  4.5: "ممتاز",
  5: "ممتاز+",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function HoverRating({
  rating,
  setRating,
}: {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [value, setValue] = React.useState(0.5);
  const [hover, setHover] = React.useState(-1);
  const params = useParams();
  return (
    <Box
      sx={{
        width: 250,
        display: "flex",
        alignItems: "center",
        backgroundColor: `rgba(255,255,255,0.06)`,
        color: "white",
        backdropFilter: "blur(8px)",
        padding: "8px 16px ",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Rating
        name="hover-feedback"
        value={rating}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={async (event, newValue: number) => {
          setRating(newValue);
          const res = await fetch(
            `https://back-writer.onrender.com/reader/rateStory/${params.idStory}`,
            {
              headers: { "Content-Type": "application/json" },

              credentials: "include",
              method: "POST",
              body: JSON.stringify({ rating: newValue }),
            },
          );
          const data = await res.json();
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        sx={{ "& .MuiRating-iconEmpty": { color: "white" } }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
    </Box>
  );
}
