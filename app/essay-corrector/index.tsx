"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { FeedbackDisplay } from "./FeedbackDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "./ImageUploader";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { EssayImage } from "@/types/essay";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1]; // 去除前缀 "data:<mimeType>;base64,"
      resolve(base64String);
    };

    reader.onerror = () => {
      reject("Failed to convert file to base64");
    };

    reader.readAsDataURL(file); // 将文件读取为 base64 格式
  });
}

const fileToGenerativePart = async (
  file: File
): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  const mimeTypeMapping: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const mimeType =
    fileExtension && mimeTypeMapping[fileExtension]
      ? mimeTypeMapping[fileExtension]
      : "application/octet-stream";
  return {
    inlineData: {
      data: await fileToBase64(file),
      mimeType,
    },
  };
};

export const EssayCorrector: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [language, setLanguage] = React.useState("English");
  const [feedback, setFeedback] = React.useState(null);
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = React.useState<File[]>([]);

  const handleClick = () => {
    if (message.trim().length < 20 && images.length === 0) {
      alert("作文内容需至少包含 20 个字");
      return;
    }

    startTransition(async () => {
      let essayImages: EssayImage[] = [];
      if (images.length > 0) {
        essayImages = await Promise.all(images.map(fileToGenerativePart));
      }

      try {
        const response = await fetch("/api/correctEssay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, language, essayImages }),
        });

        if (!response.ok) throw new Error("Failed to correct the essay");

        const result = await response.json();
        setFeedback(result);
      } catch (error) {
        console.error("Error correcting essay:", error);
        alert("批改失败，请稍后再试");
      }
    });
  };

  const handleLanguageChange = (v: string) => {
    setLanguage(v);
  };

  const handleImageChange = (path: File[]) => {
    console.log(path);
    setImages(path);
  };

  return (
    <div className="container mt-8 mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        作文批改
      </h1>

      <Tabs defaultValue="text" className="mt-8">
        <TabsList>
          <TabsTrigger value="text">输入作文</TabsTrigger>
          <TabsTrigger value="image">上传图片</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <div className="grid w-full gap-1.5 mt-8">
            <Label htmlFor="message">书写你的作文：</Label>
            <Textarea
              placeholder="在这里写你的作文"
              value={message}
              className="min-h-40 mt-2"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </TabsContent>
        <TabsContent value="image">
          <DndProvider backend={HTML5Backend}>
            <ImageUploader imagePath={images} onChange={handleImageChange} />
          </DndProvider>
        </TabsContent>
      </Tabs>

      <div className="mt-4">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="作文语言" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Chinese">中文作文</SelectItem>
            <SelectItem value="English">英文作文</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <Button onClick={handleClick}>
          {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
          {isPending ? "批改中..." : "批改作文"}
        </Button>
      </div>
      {feedback && <FeedbackDisplay feedback={feedback} />}
    </div>
  );
};
