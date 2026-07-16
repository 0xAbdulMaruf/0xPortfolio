'use client';

interface CategoryFilterProps {
    categories: string[];
    active: string;
    onChange: (category: string) => void;
}

export default function CategoryFilter({
    categories,
    active,
    onChange,
}: CategoryFilterProps) {
    return (
        <div className="cert-categories">
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`cert-category-tab ${active === cat ? 'active' : ''}`}
                    onClick={() => onChange(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
