export const languages = [
    {
        label: "Portuguese",
        value: "PORTUGUESE",
        flag: "/images/onboarding/portugalflag.svg"
    },
    {
        label: "Spanish",
        value: "SPANISH",
        flag: "/images/onboarding/spainflag.svg"
    },
    {
        label: "English",
        value: "ENGLISH",
        flag: "/images/onboarding/usaflag.svg"
    },
];

export const educationLevels = [
    { label: "ENEM 2026", value: "COMPETITIVE_EXAMS", icon: "🎯", subtitle: "Complete preparation for ENEM" },
    { label: "High School", value: "HIGH_SCHOOL", icon: "📚", subtitle: "School curriculum support" },
    { label: "Pre-University Prep", value: "PRE_VESTIBULAR", icon: "🏆", subtitle: "Intensive revision for entrance exams" },
    { label: "Public Exams", value: "PUBLIC_EXAMS", icon: "📋", subtitle: "Preparation for government/public exams" },
    { label: "College / University", value: "UNIVERSITY", icon: "🎓", subtitle: "Support for university content" },
    { label: "Elementary School", value: "ELEMENTARY", icon: "✏️", subtitle: "Strong foundation for basic education" },
];

export const step1Options = [
    {
        value: "ENGLISH",
        label: "English"
    },
    {
        value: "COMPUTER_SCIENCE",
        label: "Computer Science / Coding"
    },
    {
        value: "MATHEMATICS",
        label: "Mathematics"
    },
    {
        value: "BUSINESS_ECONOMICS",
        label: "Business / Economics"
    },
    {
        value: "SCIENCE",
        label: "Science"
    },
    {
        value: "LANGUAGES",
        label: "Languages (Portuguese, English, Spanish)"
    },
    {
        value: "HISTORY",
        label: "History"
    },
    {
        value: "OTHER",
        label: "Other"
    },
    {
        value: "GEOGRAPHY",
        label: "Geography"
    },
]

export const step2Options = [
    { value: "PREPARE_FOR_EXAM", label: "Prepare for an exam or test" },
    { value: "REVISE_PREVIOUS_KNOWLEDGE", label: "Revise / refresh previous knowledge" },
    { value: "IMPROVE_GRADES", label: "Improve grades / performance in school" },
    { value: "IMPROVE_STUDY_HABITS", label: "Improve study consistency or habits" },
    { value: "LEARN_FROM_SCRATCH", label: "Learn a new topic from scratch" },
    { value: "BUILD_LONG_TERM_MASTERY", label: "Build long-term mastery or fluency" },
];

export const goalLabels: Record<string, string> = {
    PREPARE_FOR_EXAM: "Prepare for Exam",
    IMPROVE_GRADES: "Improve Grades",
    LEARN_FROM_SCRATCH: "Learn From Scratch",
    BUILD_LONG_TERM_MASTERY: "Build Long-term Mastery",
    REVISE_PREVIOUS_KNOWLEDGE: "Revise Previous Knowledge",
    IMPROVE_STUDY_HABITS: "Improve Study Habits",
};

export const styleLabels: Record<string, string> = {
    VISUAL: "Visual",
    AI_GUIDED: "AI Guided",
    AUDITORY: "Auditory",
    READING_WRITING: "Reading/Writing",
    KINESTHETIC: "Kinesthetic",
};

export const subjectLabels: Record<string, string> = {
    ENGLISH: "English",
    MATHEMATICS: "Mathematics",
    COMPUTER_SCIENCE: "Computer Science",
    BUSINESS_ECONOMICS: "Business & Economics",
    SCIENCE: "Science",
    LANGUAGES: "Languages",
    HISTORY: "History",
    OTHER: "Other",
    GEOGRAPHY: "Geography",
};


export const Step3Options = [
    {
        value: "VISUAL",
        label: "Visual"
    },
    {
        value: "AI_GUIDED",
        label: "AI-guided"
    },
    {
        value: "AUDITORY",
        label: "Auditory"
    },
    {
        value: "READING_WRITING",
        label: "Reading/Writing"
    },
    {
        value: "KINESTHETIC",
        label: "Kinesthetic"
    },
]

export const Step4Options = [
    { value: "LESS_THAN_15_MIN", label: "<15 minutes" },
    { value: "MIN_15_TO_30", label: "15–30 minutes" },
    { value: "MIN_30_TO_60", label: "30–60 minutes" },
    { value: "ONE_HOUR", label: "1 hour" },
];

export const Step5Options = [
    {
        value: "MORNING",
        label: "Morning"
    },
    {
        value: "AFTERNOON",
        label: "Afternoon"
    },
    {
        value: "EVENING",
        label: "Evening"
    },
    {
        value: "FLEXIBLE",
        label: "Flexible"
    },
]