"use client";

import { CategoryCard } from "@/components/ui/category-card";
import { useModal } from "@/components/modal/modal-provider";
import { T } from "@/lib/i18n";
import { categories } from "@/data/categories";

export function CategoriesSection() {
  const { openModal } = useModal();

  const handleAchievementClick = (modalId?: string) => {
    if (modalId) {
      openModal(modalId);
    }
  };

  return (
    <section id="categories" className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-accent mb-2">02</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <T ko="기술 카테고리" en="Technical Categories" />
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            <T
              ko="8개 도메인에 걸친 백엔드 인프라 아키텍처"
              en="Backend infrastructure architecture across 8 domains"
            />
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              title={category.title}
              postsCount={category.postsCount}
              statusKo={category.statusKo}
              statusEn={category.statusEn}
              techBadges={category.techBadges}
              descriptionKo={category.descriptionKo}
              descriptionEn={category.descriptionEn}
              achievements={category.achievements.map((a) => ({
                icon: a.icon,
                titleKo: a.titleKo,
                titleEn: a.titleEn,
                onClick: a.modalId
                  ? () => handleAchievementClick(a.modalId)
                  : undefined,
              }))}
              blogLink={category.blogLink}
              categoryColor={category.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
