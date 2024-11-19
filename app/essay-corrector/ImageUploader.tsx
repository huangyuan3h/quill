"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import { useDrag, useDrop } from "react-dnd";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type ImageUploaderProps = {
  imagePath: File[];
  onChange: (imagePath: File[]) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imagePath,
  onChange,
}) => {
  const [images, setImages] = useState<File[]>(imagePath);

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    const updatedImages = [...images, ...newImages].slice(0, 9);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const handleRemove = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const draggedImage = images[dragIndex];
    const reorderedImages = [...images];
    reorderedImages.splice(dragIndex, 1);
    reorderedImages.splice(hoverIndex, 0, draggedImage);
    setImages(reorderedImages);
    onChange(reorderedImages);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
    maxFiles: 9 - images.length,
  });

  return (
    <div className="mt-4">
      <Label className="mb-4 text-lg font-semibold">上传图片</Label>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer mb-4 h-24 mt-4 justify-center item-centered flex"
      >
        <input {...getInputProps()} />
        <div className="flex justify-center item-centered">
          拖动或点击上传图片，支持最多9张
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((file, index) => (
          <DraggableImage
            key={index}
            src={URL.createObjectURL(file)}
            index={index}
            moveImage={moveImage}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>
    </div>
  );
};

type DraggableImageProps = {
  src: string;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onRemove: () => void;
};

const DraggableImage: React.FC<DraggableImageProps> = ({
  src,
  index,
  moveImage,
  onRemove,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "image",
    hover(item: { index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex) {
        moveImage(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative aspect-square overflow-hidden rounded-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Image
        src={src}
        alt="uploaded"
        className="object-cover w-full h-full"
        width={300}
        height={300}
      />
      <Button
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1"
        size="icon"
        onClick={onRemove}
      >
        ✕
      </Button>
    </div>
  );
};

export default ImageUploader;
