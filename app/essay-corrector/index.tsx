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

export const EssayCorrector: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [language, setLanguage] = React.useState("English");
  const [feedback, setFeedback] = React.useState(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (message.trim().length < 20) {
      alert("作文内容需至少包含 20 个字");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/correctEssay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, language }),
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

  return (
    <div className="container mt-8 mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        作文批改
      </h1>

      <div className="grid w-full gap-1.5 mt-8">
        <Label htmlFor="message">书写你的作文：</Label>
        <Textarea
          placeholder="在这里写你的作文"
          value={message}
          className="min-h-40 mt-2"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
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
      {feedback && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">批改结果</h2>
          <pre className="bg-gray-100 p-4 rounded-md mt-4">
            {JSON.stringify(feedback, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
