"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Badge } from "./badge";
import { T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Achievement {
  icon: string;
  titleKo: string;
  titleEn: string;
  onClick?: () => void;
}

interface CategoryCardProps {
  icon: string;
  title: string;
  postsCount: number;
  statusKo?: string;
  statusEn?: string;
  techBadges: string[];
  descriptionKo: string;
  descriptionEn: string;
  achievements: Achievement[];
  blogLink?: string;
  categoryColor: string;
  className?: string;
}

export function CategoryCard({
  icon,
  title,
  postsCount,
  statusKo,
  statusEn,
  techBadges,
  descriptionKo,
  descriptionEn,
  achievements,
  blogLink,
  categoryColor,
  className,
}: CategoryCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "before:absolute before:inset-0 before:opacity-0 before:transition-opacity hover:before:opacity-100",
        "border-border/50 hover:border-[var(--category-color)]/30",
        className
      )}
      style={
        {
          "--category-color": categoryColor,
        } as React.CSSProperties
      }
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, ${categoryColor}15 0%, transparent 50%)`,
        }}
      />

      <CardHeader className="gap-4">
        {/* Category Info */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <span className="text-sm text-muted-foreground">
              {postsCount} posts
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {statusKo && statusEn && (
            <Badge
              className="bg-primary/10 text-primary border-primary/20"
              variant="outline"
            >
              <T ko={statusKo} en={statusEn} />
            </Badge>
          )}
          {techBadges.map((badge) => (
            <Badge key={badge} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          <T ko={descriptionKo} en={descriptionEn} />
        </p>

        {/* Achievements */}
        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <button
              key={index}
              onClick={achievement.onClick}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                "bg-secondary/50 hover:bg-secondary",
                achievement.onClick && "cursor-pointer"
              )}
            >
              <span className="text-lg shrink-0">{achievement.icon}</span>
              <div className="text-sm">
                <T ko={achievement.titleKo} en={achievement.titleEn} />
                {achievement.onClick && (
                  <span
                    className="ml-2 text-xs"
                    style={{ color: categoryColor }}
                  >
                    <T ko="→ 상세 보기" en="→ View Details" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>

      {blogLink && (
        <CardFooter className="border-t border-border/50 pt-4">
          <a
            href={blogLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: categoryColor }}
          >
            <T ko="블로그에서 자세히 보기" en="Read more on blog" /> →
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
