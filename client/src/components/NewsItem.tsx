import React from "react";
import { formatDistanceToNow } from "date-fns";

interface NewsItemProps {
  news: {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
  };
}

const NewsItem: React.FC<NewsItemProps> = ({ news }) => {
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      "hot-gossip": "Gossip",
      innovation: "Illuminazioni",
      entertainment: "Atti divini",
      controversy: "Atti diabolici",
      miracle: "Miracoli",
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "hot-gossip": "bg-cardinal-red bg-opacity-20 text-white",
      innovation: "bg-vatican-gold bg-opacity-20 text-white",
      entertainment: "bg-papal-purple bg-opacity-20 text-white",
      controversy: "bg-cardinal-red bg-opacity-20 text-white",
      miracle: "bg-green-600 bg-opacity-20 text-white",
    };
    return colors[category] || "bg-gray-200 text-white";
  };

  const timeAgo = news.createdAt
    ? formatDistanceToNow(new Date(news.createdAt), { addSuffix: true })
    : "recently";

  return (
    <article className="border-b border-gray-200 pb-6">
      <h3 className="text-xl font-cinzel text-papal-purple mb-2">
        {news.title}
      </h3>
      <div className="flex items-center mb-3">
        <span className="text-xs text-gray-500 font-lora">
          Posted anonymously • {timeAgo}
        </span>
        <span
          className={`ml-2 px-2 py-1 ${getCategoryColor(news.category)} text-xs rounded-full`}
        >
          {getCategoryLabel(news.category)}
        </span>
      </div>
      <p className="font-lora text-gray-700">{news.content}</p>
    </article>
  );
};

export default NewsItem;
