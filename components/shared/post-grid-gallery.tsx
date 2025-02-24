"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";

export function PostGridGallery({ images }: { images: { src: string; width: number; height: number }[] }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            width={150}
            height={150}
            alt="Thumbnail"
            className="cursor-pointer rounded-lg hover:opacity-80 transition"
            onClick={() => {
              setCurrentIndex(index);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <Lightbox
        slides={images}
        open={open}
        index={currentIndex}
        close={() => setOpen(false)}
      />
    </>
  );
}
