const courses = [
    {
        title: "Python for Data Science",
        category: "Programming",
        tags: ["python", "data science"],
        level: "Beginner",
        duration: 8,
        rating: 4.8,
        popularity: 92,
        quality: 95
    },
    {
        title: "Machine Learning Foundations",
        category: "AI & ML",
        tags: ["machine learning", "python", "ai"],
        level: "Intermediate",
        duration: 10,
        rating: 4.9,
        popularity: 87,
        quality: 97
    },
    {
        title: "Web Development",
        category: "Programming",
        tags: ["html", "css", "javascript"],
        level: "Beginner",
        duration: 6,
        rating: 4.7,
        popularity: 89,
        quality: 90
    },
    {
        title: "Deep Learning",
        category: "AI & ML",
        tags: ["ai", "neural networks"],
        level: "Intermediate",
        duration: 12,
        rating: 4.8,
        popularity: 76,
        quality: 94
    },
    {
        title: "Data Visualization",
        category: "Data Science",
        tags: ["charts", "data science"],
        level: "Beginner",
        duration: 5,
        rating: 4.5,
        popularity: 70,
        quality: 88
    },
    {
        title: "UI/UX Design",
        category: "Design",
        tags: ["design", "ui", "ux"],
        level: "Beginner",
        duration: 5,
        rating: 4.6,
        popularity: 74,
        quality: 90
    }
];

const interests = new Set();

const interestBox = document.querySelector("#interest-options");
const methodSelect = document.querySelector("#method-select");
const recommendationList = document.querySelector("#recommendation-list");
const catalogList = document.querySelector("#catalog-list");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const emptyState = document.querySelector("#empty-state");

const categories = [...new Set(courses.map(c => c.category))];

categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
        if (interests.has(category)) {
            interests.delete(category);
            button.setAttribute("aria-pressed", "false");
        } else {
            interests.add(category);
            button.setAttribute("aria-pressed", "true");
        }

        renderRecommendations();
    });

    interestBox.appendChild(button);

    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
});

function getScore(course) {
    const content = interests.has(course.category) ? 100 : 0;
    const popularity = course.popularity;
    const quality = course.quality;

    if (methodSelect.value === "content") {
        return content;
    }

    if (methodSelect.value === "popular") {
        return popularity;
    }

    return 0.60 * content +
           0.25 * popularity +
           0.15 * quality;
}

function createCard(course, showScore = true) {
    const card = document.createElement("article");
    card.className = "course-card";

    const title = document.createElement("h3");
    title.textContent = course.title;

    const category = document.createElement("p");
    category.className = "category";
    category.textContent = course.category;

    const details = document.createElement("p");
    details.textContent =
        `${course.level} · ${course.duration} hours`;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${course.rating}/5`;

    card.append(title, category, details, rating);

    if (showScore) {
        const score = document.createElement("p");
        score.className = "score";
        score.textContent = `Recommendation score: ${
            getScore(course).toFixed(1)
        }`;
        card.appendChild(score);
    }

    const tags = document.createElement("p");
    tags.className = "tags";
    tags.textContent = course.tags.join(" · ");
    card.appendChild(tags);

    return card;
}

function renderRecommendations() {
    recommendationList.replaceChildren();

    [...courses]
        .sort((a, b) => getScore(b) - getScore(a))
        .slice(0, 6)
        .forEach(course => {
            recommendationList.appendChild(createCard(course));
        });
}

function renderCatalog() {
    const query = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;

    const filtered = courses.filter(course => {
        const text = [
            course.title,
            course.category,
            ...course.tags
        ].join(" ").toLowerCase();

        return text.includes(query) &&
            (category === "all" || course.category === category);
    });

    catalogList.replaceChildren();

    filtered.forEach(course => {
        catalogList.appendChild(createCard(course, false));
    });

    emptyState.hidden = filtered.length > 0;
}

methodSelect.addEventListener("change", renderRecommendations);
searchInput.addEventListener("input", renderCatalog);
categoryFilter.addEventListener("change", renderCatalog);

renderRecommendations();
renderCatalog();
