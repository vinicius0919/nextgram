"use client";
import { useState } from "react";
import Label from "./Label";
import Image from "next/image";

interface ImagePreviewProps {
  setFileSize: (size: number) => void;
}
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const ImagePreview: React.FC<ImagePreviewProps> = ({ setFileSize }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileSize(file.size);
      if (file.size > MAX_FILE_SIZE) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSelectedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {imagePreview && (
        <div className="flex justify-center mb-4">
          <Image
            src={imagePreview}
            alt="Image Preview"
            className="w-[494px] h-[494px] object-cover"
            width={494}
            height={494}
          />
        </div>
      )}
      <Label text="Selecione uma imagem" htmlFor="image" />
      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        size={MAX_FILE_SIZE}
        onChange={handleImageChange}
        className="p-2 border border-zinc-500 rounded w-full text-sm placeholder:text-zinc-500 focus:ring-0 focus:outline-none"
      />
      <p>Escolha uma imagem com tamanho inferior a 1MB</p>
      {selectedImage && (
        <input type="hidden" name="imageFile" value={selectedImage.name} />
      )}
    </div>
  );
};

export default ImagePreview;
