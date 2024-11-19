import { EssayFeedback } from "@/types/essay";

type FeedbackDisplayProps = {
  feedback: EssayFeedback;
};

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  feedback,
}) => {
  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">批改结果</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">评分</h3>
        <p>{feedback.score} 分</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">总结</h3>
        <p>{feedback.summary}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">拼写修改</h3>
        {feedback.corrections.map((correction, index) => (
          <div key={index} className="p-2 bg-white rounded-md mb-2">
            <p>
              <strong>原文:</strong> {correction.original}
            </p>
            <p>
              <strong>修改:</strong> {correction.corrected}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold">高级用法建议</h3>
        {feedback.advanced_suggestions.map((suggestion, index) => (
          <div key={index} className="p-2 bg-white rounded-md mb-2">
            <p>
              <strong>建议:</strong> {suggestion.text}
            </p>
            <p>
              <strong>解释:</strong> {suggestion.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
