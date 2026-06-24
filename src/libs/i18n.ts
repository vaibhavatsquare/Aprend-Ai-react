import { UserLanguage } from './types';
import { useLanguageStore } from '@/src/store/language.store';

// Type-safe translation keys
type TranslationKey =
    // Common
    | 'common.loading' | 'common.error' | 'common.success' | 'common.cancel' | 'common.save'
    | 'common.delete' | 'common.edit' | 'common.back' | 'common.next' | 'common.continue'
    | 'common.finish' | 'common.close' | 'common.confirm' | 'common.retry' | 'common.skip'
    | 'common.submit' | 'common.tryAgain' | 'common.gotIt' | 'common.done' | 'common.yes'
    | 'common.no' | 'common.ok' | 'common.search' | 'common.filter' | 'common.clear'
    | 'common.select' | 'common.all' | 'common.none' | 'common.other' | 'common.total'
    | 'common.remaining' | 'common.progress' | 'common.completed' | 'common.pending'
    | 'common.active' | 'common.inactive' | 'common.enabled' | 'common.disabled'
    | 'common.online' | 'common.offline' | 'common.today' | 'common.yesterday'
    | 'common.tomorrow' | 'common.thisWeek' | 'common.lastWeek' | 'common.thisMonth'
    | 'common.lastMonth' | 'common.thisYear' | 'common.lastYear' | 'common.saving'
    | 'common.generating' | 'common.listening'

    // Navigation
    | 'nav.home' | 'nav.flashcards' | 'nav.notes' | 'nav.profile' | 'nav.settings'
    | 'nav.logout' | 'nav.login' | 'nav.signup' | 'nav.dashboard' | 'nav.library'
    | 'nav.help' | 'nav.about' | 'nav.contact' | 'nav.privacy' | 'nav.terms'

    // Auth
    | 'auth.signIn' | 'auth.signUp' | 'auth.signOut' | 'auth.email' | 'auth.password'
    | 'auth.confirmPassword' | 'auth.forgotPassword' | 'auth.resetPassword'
    | 'auth.createAccount' | 'auth.alreadyHaveAccount' | 'auth.dontHaveAccount'
    | 'auth.welcomeBack' | 'auth.createYourAccount' | 'auth.enterYourEmail'
    | 'auth.enterYourPassword' | 'auth.rememberMe' | 'auth.invalidEmail'
    | 'auth.passwordRequired' | 'auth.emailRequired' | 'auth.passwordMismatch'
    | 'auth.loginSuccess' | 'auth.loginFailed' | 'auth.signupSuccess'
    | 'auth.signupFailed' | 'auth.logoutSuccess' | 'auth.logoutFailed'

    // Onboarding
    | 'onboarding.welcome' | 'onboarding.chooseLanguage' | 'onboarding.chooseEducationLevel'
    | 'onboarding.placementQuiz' | 'onboarding.elementary' | 'onboarding.highSchool'
    | 'onboarding.preUniversity' | 'onboarding.university' | 'onboarding.competitiveExams'
    | 'onboarding.getStarted' | 'onboarding.skipForNow' | 'onboarding.completeProfile'
    | 'onboarding.almostDone' | 'onboarding.letsPersonalize'

    // Home
    | 'home.greeting.morning' | 'home.greeting.afternoon' | 'home.greeting.evening'
    | 'home.readyToStart' | 'home.streak.startJourney' | 'home.streak.studiedDays'
    | 'home.streak.keepItUp' | 'home.streak.days' | 'home.tasks.todaysTask'
    | 'home.tasks.progress' | 'home.tasks.noTasksScheduled' | 'home.tasks.completed'
    | 'home.tasks.pending' | 'home.aiTutor.ready' | 'home.aiTutor.uploadNotes'
    | 'home.aiTutor.uploadDescription' | 'home.questionBank.title'
    | 'home.questionBank.exploreQuestions' | 'home.questionBank.description'
    | 'home.simulados.title' | 'home.simulados.description'
    | 'home.simulados.createSimulados' | 'home.simulados.chooseSubject'
    | 'home.simulados.numberOfQuestions' | 'home.simulados.selectDifficulty'
    | 'home.simulados.easy' | 'home.simulados.medium' | 'home.simulados.hard'
    | 'home.simulados.mix' | 'home.weakSpotTracker.title'

    // Questions
    | 'questions.chooseHowToPractice' | 'questions.selectModeToContinue'
    | 'questions.questionBank' | 'questions.practiceTopicWise'
    | 'questions.exploreQuestions' | 'questions.createSimulados'
    | 'questions.buildCustomMockTest' | 'questions.chooseSubject'
    | 'questions.customiseYourSimulados' | 'questions.allSubjects'
    | 'questions.english' | 'questions.mathematics' | 'questions.science'
    | 'questions.history' | 'questions.geography' | 'questions.numberOfQuestions'
    | 'questions.selectDifficulty' | 'questions.tapToRevealAnswer'
    | 'questions.correctAnswer' | 'questions.wrongAnswer' | 'questions.heresSolution'
    | 'questions.explanation' | 'questions.skipExplanation' | 'questions.seeAnswer'
    | 'questions.why'

    // Flashcards
    | 'flashcards.title' | 'flashcards.savedFlashcards' | 'flashcards.noSavedFlashcards'
    | 'flashcards.noSavedFlashcardsDesc' | 'flashcards.tapToReveal' | 'flashcards.tapToFlipBack' | 'flashcards.rename'
    | 'flashcards.remove' | 'flashcards.delete' | 'flashcards.areYouSureDelete'

    // Notes
    | 'notes.title' | 'notes.savedNotes' | 'notes.noSavedNotes' | 'notes.noSavedNotesDesc'
    | 'notes.uploadNotes' | 'notes.uploadDescription' | 'notes.rename' | 'notes.remove'
    | 'notes.delete' | 'notes.areYouSureDelete'

    // Library
    | 'library.title' | 'library.savedLibrary' | 'library.noSavedLibrary'
    | 'library.noSavedLibraryDesc' | 'library.rename' | 'library.remove'
    | 'library.delete' | 'library.areYouSureDelete'

    // Profile
    | 'profile.title' | 'profile.editProfile' | 'profile.savedNotes'
    | 'profile.savedFlashcards' | 'profile.savedSummaries' | 'profile.achievements'
    | 'profile.mySubscription' | 'profile.termsConditions' | 'profile.privacyPolicy'
    | 'profile.logout' | 'profile.deleteAccount' | 'profile.preferredLanguage'
    | 'profile.notificationPreference' | 'profile.educationLevel' | 'profile.name'
    | 'profile.emailAddress' | 'profile.subscription.premiumPlan'
    | 'profile.subscription.currentlySubscribed' | 'profile.achievementsList.dayStreak'
    | 'profile.achievementsList.moduleComplete' | 'profile.achievementsList.star'
    | 'profile.confirmLogout' | 'profile.confirmDelete' | 'profile.languageUpdated'
    | 'profile.languageUpdateFailed'

    // Notifications
    | 'notifications.title' | 'notifications.today' | 'notifications.yesterday'
    | 'notifications.projectAlphaDue' | 'notifications.reviewWeakSpots'
    | 'notifications.dailyQuizReady' | 'notifications.progressImproved'

    // Empty States
    | 'emptyStates.noData' | 'emptyStates.noResults' | 'emptyStates.nothingHere'
    | 'emptyStates.getStarted'

    // Errors
    | 'errors.somethingWentWrong' | 'errors.networkError' | 'errors.serverError'
    | 'errors.notFound' | 'errors.unauthorized' | 'errors.forbidden'
    | 'errors.validationError' | 'errors.required' | 'errors.invalidFormat'
    | 'errors.tooShort' | 'errors.tooLong' | 'errors.emailInvalid' | 'errors.passwordWeak'
    | 'errors.fileTooBig' | 'errors.unsupportedFile'

    // Success
    | 'success.saved' | 'success.updated' | 'success.deleted' | 'success.uploaded'
    | 'success.downloaded' | 'success.copied' | 'success.moved' | 'success.completed'

    // Time
    | 'time.seconds' | 'time.minutes' | 'time.hours' | 'time.days' | 'time.weeks'
    | 'time.months' | 'time.years' | 'time.ago' | 'time.fromNow' | 'time.justNow'
    | 'time.inAMoment'

    | 'home.tasks.conceptExplanation'
    | 'home.tasks.noTasksTitle' | 'home.tasks.noTasksSubtitle'
    | 'subscription.manage' | 'subscription.checkPlanOverview'
    | 'subscription.activeFrom' | 'subscription.expireOn'
    | 'subscription.backToHome' | 'subscription.cancel'
    | 'subscription.free' | 'subscription.monthly' | 'subscription.yearly'
    | 'subscription.restore' | 'subscription.upgradeToPremium'
    | 'limits.dailyQuestion' | 'limits.dailyFlashcard' | 'limits.focusModePremium'
    | 'achievements.new' | 'achievements.empty'
    | 'aiTutor.generateFlashcards' | 'aiTutor.saveNotes'

    | 'subscription.your'

    | 'subscription.status' | 'subscription.statusDescription' | 'subscription.trialDescription'

    | 'limits.weakSpotTracker' | 'limits.flashcardLimit'

    | 'aiTutor.uploadImage' | 'aiTutor.camera' | 'aiTutor.gallery'
    | 'aiTutor.notesSaved' | 'aiTutor.flashcardsGenerated'
    | 'common.premiumFeature'
    | 'profile.saveToProfile'
    | 'profile.notificationUpdated'
    | 'profile.notificationUpdateFailed'
    | 'home.streak.consistencyMessage' | 'home.streak.milestone' | 'home.streak.milestoneSubtext'

    // Add to TranslationKey
    | 'quiz.q1' | 'quiz.q2' | 'quiz.q3' | 'quiz.q4' | 'quiz.q5'
    | 'quiz.subject' | 'quiz.goal' | 'quiz.learningStyle' | 'quiz.startJourney' | 'quiz.congratulations'
    | 'quiz.writeSubjectHere'
    | 'quiz.option.english' | 'quiz.option.mathematics' | 'quiz.option.science'
    | 'quiz.option.history' | 'quiz.option.geography' | 'quiz.option.computerScience'
    | 'quiz.option.business' | 'quiz.option.languages' | 'quiz.option.other'
    | 'quiz.option.exam' | 'quiz.option.grades' | 'quiz.option.newTopic'
    | 'quiz.option.mastery' | 'quiz.option.revise' | 'quiz.option.consistency'
    | 'quiz.option.visual' | 'quiz.option.auditory' | 'quiz.option.reading'
    | 'quiz.option.kinesthetic' | 'quiz.option.aiGuided'
    | 'quiz.option.less15' | 'quiz.option.15to30' | 'quiz.option.30to60' | 'quiz.option.1hour'
    | 'quiz.option.morning' | 'quiz.option.afternoon' | 'quiz.option.evening' | 'quiz.option.flexible'

    | 'navbar.focusMode.on'
    | 'navbar.focusMode.off'



    ;



// Translation object with type safety
const translations = {
    ENGLISH: {
        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.back': 'Back',
        'common.next': 'Next',
        'common.continue': 'Continue',
        'common.finish': 'Finish',
        'common.close': 'Close',
        'common.confirm': 'Confirm',
        'common.retry': 'Retry',
        'common.skip': 'Skip',
        'common.submit': 'Submit',
        'common.tryAgain': 'Try Again',
        'common.gotIt': 'Got it',
        'common.done': 'Done',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.ok': 'OK',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.clear': 'Clear',
        'common.select': 'Select',
        'common.all': 'All',
        'common.none': 'None',
        'common.other': 'Other',
        'common.total': 'Total',
        'common.remaining': 'Remaining',
        'common.progress': 'Progress',
        'common.completed': 'Completed',
        'common.pending': 'Pending',
        'common.active': 'Active',
        'common.inactive': 'Inactive',
        'common.enabled': 'Enabled',
        'common.disabled': 'Disabled',
        'common.online': 'Online',
        'common.offline': 'Offline',
        'common.today': 'Today',
        'common.yesterday': 'Yesterday',
        'common.tomorrow': 'Tomorrow',
        'common.thisWeek': 'This Week',
        'common.lastWeek': 'Last Week',
        'common.thisMonth': 'This Month',
        'common.lastMonth': 'Last Month',
        'common.thisYear': 'This Year',
        'common.lastYear': 'Last Year',
        'common.saving': 'Saving',
        'common.generating': 'Generating',
        'common.listening': 'Listening',

        // Navigation
        'nav.home': 'Home',
        'nav.flashcards': 'Flashcards',
        'nav.notes': 'Notes',
        'nav.profile': 'Profile',
        'nav.settings': 'Settings',
        'nav.logout': 'Logout',
        'nav.login': 'Login',
        'nav.signup': 'Sign Up',
        'nav.dashboard': 'Dashboard',
        'nav.library': 'Library',
        'nav.help': 'Help',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'nav.privacy': 'Privacy Policy',
        'nav.terms': 'Terms & Conditions',

        // Auth
        'auth.signIn': 'Sign In',
        'auth.signUp': 'Sign Up',
        'auth.signOut': 'Sign Out',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.confirmPassword': 'Confirm Password',
        'auth.forgotPassword': 'Forgot Password?',
        'auth.resetPassword': 'Reset Password',
        'auth.createAccount': 'Create Account',
        'auth.alreadyHaveAccount': 'Already have an account?',
        'auth.dontHaveAccount': "Don't have an account?",
        'auth.welcomeBack': 'Welcome Back',
        'auth.createYourAccount': 'Create Your Account',
        'auth.enterYourEmail': 'Enter your email',
        'auth.enterYourPassword': 'Enter your password',
        'auth.rememberMe': 'Remember me',
        'auth.invalidEmail': 'Invalid email address',
        'auth.passwordRequired': 'Password is required',
        'auth.emailRequired': 'Email is required',
        'auth.passwordMismatch': 'Passwords do not match',
        'auth.loginSuccess': 'Login successful',
        'auth.loginFailed': 'Login failed',
        'auth.signupSuccess': 'Account created successfully',
        'auth.signupFailed': 'Account creation failed',
        'auth.logoutSuccess': 'Logged out successfully',
        'auth.logoutFailed': 'Logout failed',

        // Onboarding
        'onboarding.welcome': 'Welcome',
        'onboarding.chooseLanguage': 'Choose your language',
        'onboarding.chooseEducationLevel': 'Choose your education level',
        'onboarding.placementQuiz': 'Placement Quiz',
        'onboarding.elementary': 'Elementary',
        'onboarding.highSchool': 'High School',
        'onboarding.preUniversity': 'Pre-University',
        'onboarding.university': 'University',
        'onboarding.competitiveExams': 'Competitive Exams',
        'onboarding.getStarted': 'Get Started',
        'onboarding.skipForNow': 'Skip for now',
        'onboarding.completeProfile': 'Complete Your Profile',
        'onboarding.almostDone': 'Almost Done!',
        'onboarding.letsPersonalize': "Let's personalize your experience",

        // Home
        'home.greeting.morning': 'Good Morning',
        'home.greeting.afternoon': 'Good Afternoon',
        'home.greeting.evening': 'Good Evening',
        'home.readyToStart': 'Ready to start your learning journey today',
        'home.streak.startJourney': 'Start your learning journey today 🚀',
        'home.streak.studiedDays': 'You\'ve studied {count} days in a row!',
        'home.streak.keepItUp': 'Keep it up 💪',
        'home.streak.milestone': 'Incredible! {count} days of pure focus in a row! 🧠⚡',
        'home.streak.milestoneSubtext': "You're officially above average. Protect your streak!",
        'home.streak.days': 'days',
        'home.tasks.todaysTask': 'Today\'s Task',
        'home.tasks.progress': 'Progress',
        'home.tasks.noTasksScheduled': 'No tasks scheduled',
        'home.tasks.completed': 'Completed',
        'home.tasks.pending': 'Pending',
        'home.aiTutor.ready': 'Your AI Tutor is Ready to Help',
        'home.aiTutor.uploadNotes': 'Upload Notes',
        'home.aiTutor.uploadDescription': 'Upload images to create new study sets.',
        'home.aiTutor.askQuestion': 'Ask Your AI Tutor',
        'home.questionBank.title': 'Question Bank',
        'home.questionBank.exploreQuestions': 'Explore Questions',
        'home.questionBank.description': 'Practice topic wise questions',
        'home.simulados.title': 'Create your own simulados',
        'home.simulados.description': 'Build a custom mock test your way',
        'home.simulados.createSimulados': 'Create simulados',
        'home.simulados.chooseSubject': 'Choose Subject',
        'home.simulados.numberOfQuestions': 'Number of Questions',
        'home.simulados.selectDifficulty': 'Select difficulty',
        'home.simulados.easy': 'Easy',
        'home.simulados.medium': 'Medium',
        'home.simulados.hard': 'Hard',
        'home.simulados.mix': 'Mix',
        'home.weakSpotTracker.title': 'Weak Spot Tracker',

        // Questions
        'questions.chooseHowToPractice': 'Choose How You Want to Practice',
        'questions.selectModeToContinue': 'Select a mode to continue',
        'questions.questionBank': 'Question bank',
        'questions.practiceTopicWise': 'Practice topic wise questions',
        'questions.exploreQuestions': 'Explore Questions',
        'questions.createSimulados': 'Create your own simulados',
        'questions.buildCustomMockTest': 'Build a custom mock test your way',
        'questions.chooseSubject': 'Choose Subject',
        'questions.customiseYourSimulados': 'Customize your simulados',
        'questions.allSubjects': 'All Subjects',
        'questions.english': 'English',
        'questions.mathematics': 'Mathematics',
        'questions.science': 'Science',
        'questions.history': 'History',
        'questions.geography': 'Geography',
        'questions.numberOfQuestions': 'Number of Question',
        'questions.selectDifficulty': 'Select difficulty',
        'questions.tapToRevealAnswer': 'Tap to reveal answer',
        'questions.correctAnswer': '🎉 Correct Answer',
        'questions.wrongAnswer': '❌ Wrong Answer',
        'questions.heresSolution': '🧠 Here\'s the solution',
        'questions.explanation': 'Explanation:',
        'questions.skipExplanation': 'Skip explanation',
        'questions.seeAnswer': 'See answer',
        'questions.why': 'Why?',

        // Flashcards
        'flashcards.title': 'Flashcard',
        'flashcards.savedFlashcards': 'Saved Flashcards',
        'flashcards.noSavedFlashcards': 'No Saved Flashcards Yet',
        'flashcards.noSavedFlashcardsDesc': 'You haven\'t saved any flashcards. Save one to see it here.',
        'flashcards.tapToReveal': 'Tap to reveal the answer',
        'flashcards.tapToFlipBack': 'Tap to flip back',
        'flashcards.rename': 'Rename',
        'flashcards.remove': 'Remove',
        'flashcards.delete': 'Delete',
        'flashcards.areYouSureDelete': 'Are you sure you want to delete this item?',

        // Notes
        'notes.title': 'Notes',
        'notes.savedNotes': 'Saved Notes',
        'notes.noSavedNotes': 'No Saved Notes Yet',
        'notes.noSavedNotesDesc': 'You haven\'t saved any notes. Start saving notes to see them here.',
        'notes.uploadNotes': 'Upload Notes',
        'notes.uploadDescription': 'Upload images to create new study sets.',
        'notes.rename': 'Rename',
        'notes.remove': 'Remove',
        'notes.delete': 'Delete',
        'notes.areYouSureDelete': 'Are you sure you want to delete this item?',

        // Library
        'library.title': 'Library',
        'library.savedLibrary': 'Saved Library',
        'library.noSavedLibrary': 'No Saved Library Yet',
        'library.noSavedLibraryDesc': 'You haven\'t saved any library. Save one to see it here.',
        'library.rename': 'Rename',
        'library.remove': 'Remove',
        'library.delete': 'Delete',
        'library.areYouSureDelete': 'Are you sure you want to delete this item?',

        // Profile
        'profile.title': 'Profile',
        'profile.editProfile': 'Edit Profile',
        'profile.savedNotes': 'Saved Notes',
        'profile.savedFlashcards': 'Saved Flashcards',
        'profile.savedSummaries': 'Saved Summaries',
        'profile.achievements': 'Achievements',
        'profile.mySubscription': 'My Subscription',
        'profile.termsConditions': 'Terms & Conditions',
        'profile.privacyPolicy': 'Privacy Policy',
        'profile.logout': 'Logout',
        'profile.deleteAccount': 'Delete Account',
        'profile.preferredLanguage': 'Preferred Language',
        'profile.notificationPreference': 'Notification Preference',
        'profile.educationLevel': 'Education level:',
        'profile.name': 'Name',
        'profile.emailAddress': 'Email Address',
        'profile.subscription.premiumPlan': 'Premium Plan',
        'profile.subscription.currentlySubscribed': 'You are currently subscribed to Premium.',
        'profile.achievementsList.dayStreak': '7-day streak!',
        'profile.achievementsList.moduleComplete': 'Module Complete',
        'profile.achievementsList.star': 'You\'re a Star!',
        'profile.confirmLogout': 'Are you sure you want to logout from the app?',
        'profile.confirmDelete': 'Are you sure you want to delete your account?',
        'profile.languageUpdated': 'Language updated',
        'profile.languageUpdateFailed': 'Failed to update language',

        // Notifications
        'notifications.title': 'Notification',
        'notifications.today': 'Today',
        'notifications.yesterday': 'Yesterday',
        'notifications.projectAlphaDue': 'Project Alpha Due tomorrow',
        'notifications.reviewWeakSpots': 'Review Your Weak Spots',
        'notifications.dailyQuizReady': 'Your daily quiz is ready! Let\'s practice the areas that need a little more focus.',
        'notifications.progressImproved': 'You improved by +12% yesterday! Keep it up',

        // Empty States
        'emptyStates.noData': 'No data available',
        'emptyStates.noResults': 'No results found',
        'emptyStates.nothingHere': 'Nothing here yet',
        'emptyStates.getStarted': 'Get started by adding your first item',

        // Errors
        'errors.somethingWentWrong': 'Something went wrong',
        'errors.networkError': 'Network error. Please check your connection.',
        'errors.serverError': 'Server error. Please try again later.',
        'errors.notFound': 'Page not found',
        'errors.unauthorized': 'Unauthorized access',
        'errors.forbidden': 'Access forbidden',
        'errors.validationError': 'Validation error',
        'errors.required': 'This field is required',
        'errors.invalidFormat': 'Invalid format',
        'errors.tooShort': 'Too short',
        'errors.tooLong': 'Too long',
        'errors.emailInvalid': 'Invalid email address',
        'errors.passwordWeak': 'Password is too weak',
        'errors.fileTooBig': 'File is too big',
        'errors.unsupportedFile': 'Unsupported file format',

        // Success
        'success.saved': 'Saved successfully',
        'success.updated': 'Updated successfully',
        'success.deleted': 'Deleted successfully',
        'success.uploaded': 'Uploaded successfully',
        'success.downloaded': 'Downloaded successfully',
        'success.copied': 'Copied to clipboard',
        'success.moved': 'Moved successfully',
        'success.completed': 'Completed successfully',

        // Time
        'time.seconds': 'seconds',
        'time.minutes': 'minutes',
        'time.hours': 'hours',
        'time.days': 'days',
        'time.weeks': 'weeks',
        'time.months': 'months',
        'time.years': 'years',
        'time.ago': 'ago',
        'time.fromNow': 'from now',
        'time.justNow': 'just now',
        'time.inAMoment': 'in a moment',

        'home.tasks.conceptExplanation': 'Concept Explanation',
        'home.tasks.noTasksTitle': 'No tasks today',
        'home.tasks.noTasksSubtitle': 'Pick another date or generate a new plan to keep your streak going.',
        'subscription.manage': 'Manage subscription',
        'subscription.checkPlanOverview': 'Check your plan overview:',
        'subscription.activeFrom': 'Active from',
        'subscription.expireOn': 'Expire on',
        'subscription.backToHome': 'Back to home',
        'subscription.cancel': 'Cancel subscription',
        'subscription.free': 'Free',
        'subscription.monthly': 'Monthly',
        'subscription.yearly': 'Yearly',
        'subscription.restore': 'Restore',
        'subscription.upgradeToPremium': 'Upgrade to premium',
        'limits.dailyQuestion': 'Daily question limit reached.',
        'limits.dailyFlashcard': 'Daily flashcard limit reached.',
        'limits.focusModePremium': 'Focus mode is available for premium users',
        'achievements.new': 'New Achievement',
        'achievements.empty': 'No Achievements available yet.',
        'aiTutor.generateFlashcards': 'Generate Flashcards',
        'aiTutor.saveNotes': 'Save to Notes',

        'subscription.your': 'Your',

        'subscription.status': 'Status',
        'subscription.statusDescription': 'You can explore all features and content without limits.',
        'subscription.trialDescription': 'You are on a free trial. You will be charged after the trial ends.',

        'limits.weakSpotTracker': 'Weak Spot Tracker is a premium feature. Upgrade your plan to get advanced analytics.',
        'limits.flashcardLimit': 'You\'ve used all 12 daily flashcards. Upgrade to Premium for unlimited flashcards.',

        'aiTutor.uploadImage': 'Upload image',
        'aiTutor.camera': 'Camera',
        'aiTutor.gallery': 'Gallery',
        'aiTutor.notesSaved': 'Notes saved successfully',
        'aiTutor.flashcardsGenerated': 'Flashcards generated successfully',
        'common.premiumFeature': 'Premium Feature',
        'profile.saveToProfile': 'Save to Profile',
        'profile.notificationUpdated': 'Notification preference updated',
        'profile.notificationUpdateFailed': 'Failed to update notification preference',
        'home.streak.consistencyMessage': 'Consistency builds mastery. Let\'s begin!',

        'quiz.q1': 'What subject do you want to learn?',
        'quiz.q2': "What's your main learning goal?",
        'quiz.q3': "What's your learning style?",
        'quiz.q4': 'How much time can you study each day?',
        'quiz.q5': 'When do you prefer to study?',
        'quiz.subject': 'Subject',
        'quiz.goal': 'Goal',
        'quiz.learningStyle': 'Learning Style',
        'quiz.startJourney': 'Start Your Learning Journey',
        'quiz.congratulations': 'Congratulation! Your study plan is ready.',
        'quiz.writeSubjectHere': 'Write your subject here',
        'quiz.option.english': 'English',
        'quiz.option.mathematics': 'Mathematics',
        'quiz.option.science': 'Science',
        'quiz.option.history': 'History',
        'quiz.option.geography': 'Geography',
        'quiz.option.computerScience': 'Computer Science / Coding',
        'quiz.option.business': 'Business / Economics',
        'quiz.option.languages': 'Languages',
        'quiz.option.other': 'Other',
        'quiz.option.exam': 'Prepare for an exam or test',
        'quiz.option.grades': 'Improve grades / performance in school',
        'quiz.option.newTopic': 'Learn a new topic from scratch',
        'quiz.option.mastery': 'Build long-term mastery or fluency',
        'quiz.option.revise': 'Revise / refresh previous knowledge',
        'quiz.option.consistency': 'Improve study consistency or habits',
        'quiz.option.visual': 'Visual',
        'quiz.option.auditory': 'Auditory',
        'quiz.option.reading': 'Reading/Writing',
        'quiz.option.kinesthetic': 'Kinesthetic',
        'quiz.option.aiGuided': 'AI-guided',
        'quiz.option.less15': '<15 minutes',
        'quiz.option.15to30': '15-30 minutes',
        'quiz.option.30to60': '30-60 minutes',
        'quiz.option.1hour': '1 hour',
        'quiz.option.morning': 'Morning',
        'quiz.option.afternoon': 'Afternoon',
        'quiz.option.evening': 'Evening',
        'quiz.option.flexible': 'Flexible',

        'navbar.focusMode.on': 'FOCUS',
        'navbar.focusMode.off': 'OFF',
    },

    SPANISH: {
        // Common
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        'common.success': 'Éxito',
        'common.cancel': 'Cancelar',
        'common.save': 'Guardar',
        'common.delete': 'Eliminar',
        'common.edit': 'Editar',
        'common.back': 'Atrás',
        'common.next': 'Siguiente',
        'common.continue': 'Continuar',
        'common.finish': 'Finalizar',
        'common.close': 'Cerrar',
        'common.confirm': 'Confirmar',
        'common.retry': 'Reintentar',
        'common.skip': 'Omitir',
        'common.submit': 'Enviar',
        'common.tryAgain': 'Intentar de nuevo',
        'common.gotIt': 'Entendido',
        'common.done': 'Hecho',
        'common.yes': 'Sí',
        'common.no': 'No',
        'common.ok': 'OK',
        'common.search': 'Buscar',
        'common.filter': 'Filtrar',
        'common.clear': 'Limpiar',
        'common.select': 'Seleccionar',
        'common.all': 'Todos',
        'common.none': 'Ninguno',
        'common.other': 'Otro',
        'common.total': 'Total',
        'common.remaining': 'Restante',
        'common.progress': 'Progreso',
        'common.completed': 'Completado',
        'common.pending': 'Pendiente',
        'common.active': 'Activo',
        'common.inactive': 'Inactivo',
        'common.enabled': 'Habilitado',
        'common.disabled': 'Deshabilitado',
        'common.online': 'En línea',
        'common.offline': 'Fuera de línea',
        'common.today': 'Hoy',
        'common.yesterday': 'Ayer',
        'common.tomorrow': 'Mañana',
        'common.thisWeek': 'Esta semana',
        'common.lastWeek': 'La semana pasada',
        'common.thisMonth': 'Este mes',
        'common.lastMonth': 'El mes pasado',
        'common.thisYear': 'Este año',
        'common.lastYear': 'El año pasado',
        'common.saving': 'Guardando',
        'common.generating': 'Generando',
        'common.listening': 'Escuchando',

        // Navigation
        'nav.home': 'Inicio',
        'nav.flashcards': 'Tarjetas',
        'nav.notes': 'Notas',
        'nav.profile': 'Perfil',
        'nav.settings': 'Configuración',
        'nav.logout': 'Cerrar sesión',
        'nav.login': 'Iniciar sesión',
        'nav.signup': 'Registrarse',
        'nav.dashboard': 'Panel',
        'nav.library': 'Biblioteca',
        'nav.help': 'Ayuda',
        'nav.about': 'Acerca de',
        'nav.contact': 'Contacto',
        'nav.privacy': 'Política de privacidad',
        'nav.terms': 'Términos y condiciones',

        // Auth
        'auth.signIn': 'Iniciar sesión',
        'auth.signUp': 'Registrarse',
        'auth.signOut': 'Cerrar sesión',
        'auth.email': 'Correo electrónico',
        'auth.password': 'Contraseña',
        'auth.confirmPassword': 'Confirmar contraseña',
        'auth.forgotPassword': '¿Olvidaste tu contraseña?',
        'auth.resetPassword': 'Restablecer contraseña',
        'auth.createAccount': 'Crear cuenta',
        'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
        'auth.dontHaveAccount': '¿No tienes una cuenta?',
        'auth.welcomeBack': 'Bienvenido de nuevo',
        'auth.createYourAccount': 'Crea tu cuenta',
        'auth.enterYourEmail': 'Ingresa tu correo electrónico',
        'auth.enterYourPassword': 'Ingresa tu contraseña',
        'auth.rememberMe': 'Recordarme',
        'auth.invalidEmail': 'Dirección de correo inválida',
        'auth.passwordRequired': 'La contraseña es requerida',
        'auth.emailRequired': 'El correo electrónico es requerido',
        'auth.passwordMismatch': 'Las contraseñas no coinciden',
        'auth.loginSuccess': 'Inicio de sesión exitoso',
        'auth.loginFailed': 'Falló el inicio de sesión',
        'auth.signupSuccess': 'Cuenta creada exitosamente',
        'auth.signupFailed': 'Falló la creación de cuenta',
        'auth.logoutSuccess': 'Sesión cerrada exitosamente',
        'auth.logoutFailed': 'Falló el cierre de sesión',

        // Onboarding
        'onboarding.welcome': 'Bienvenido',
        'onboarding.chooseLanguage': 'Elige tu idioma',
        'onboarding.chooseEducationLevel': 'Elige tu nivel educativo',
        'onboarding.placementQuiz': 'Prueba de colocación',
        'onboarding.elementary': 'Primaria',
        'onboarding.highSchool': 'Secundaria',
        'onboarding.preUniversity': 'Preuniversitario',
        'onboarding.university': 'Universidad',
        'onboarding.competitiveExams': 'Exámenes competitivos',
        'onboarding.getStarted': 'Comenzar',
        'onboarding.skipForNow': 'Omitir por ahora',
        'onboarding.completeProfile': 'Completa tu perfil',
        'onboarding.almostDone': '¡Casi terminado!',
        'onboarding.letsPersonalize': 'Personalicemos tu experiencia',

        // Home
        'home.greeting.morning': 'Buenos días',
        'home.greeting.afternoon': 'Buenas tardes',
        'home.greeting.evening': 'Buenas noches',
        'home.readyToStart': 'Listo para comenzar tu viaje de aprendizaje hoy',
        'home.streak.startJourney': 'Comienza tu viaje de aprendizaje hoy 🚀',
        'home.streak.studiedDays': '¡Has estudiado {count} días seguidos!',
        'home.streak.keepItUp': '¡Sigue así 💪',
        'home.streak.milestone': '¡Increíble! ¡{count} días seguidos de puro enfoque! 🧠⚡',
        'home.streak.milestoneSubtext': '¡Estás por encima del promedio. Protege tu racha!',
        'home.streak.days': 'días',
        'home.tasks.todaysTask': 'Tarea de hoy',
        'home.tasks.progress': 'Progreso',
        'home.tasks.noTasksScheduled': 'No hay tareas programadas',
        'home.tasks.completed': 'Completado',
        'home.tasks.pending': 'Pendiente',
        'home.aiTutor.ready': 'Tu tutor de IA está listo para ayudarte',
        'home.aiTutor.uploadNotes': 'Subir notas',
        'home.aiTutor.uploadDescription': 'Sube imágenes para crear nuevos conjuntos de estudio.',
        'home.aiTutor.askQuestion': 'Pregúntale a tu tutor IA',
        'home.questionBank.title': 'Banco de preguntas',
        'home.questionBank.exploreQuestions': 'Explorar preguntas',
        'home.questionBank.description': 'Practica preguntas por tema',
        'home.simulados.title': 'Crea tus propios simulados',
        'home.simulados.description': 'Construye una prueba personalizada a tu manera',
        'home.simulados.createSimulados': 'Crear simulados',
        'home.simulados.chooseSubject': 'Elegir materia',
        'home.simulados.numberOfQuestions': 'Número de preguntas',
        'home.simulados.selectDifficulty': 'Seleccionar dificultad',
        'home.simulados.easy': 'Fácil',
        'home.simulados.medium': 'Medio',
        'home.simulados.hard': 'Difícil',
        'home.simulados.mix': 'Mezcla',
        'home.weakSpotTracker.title': 'Seguimiento de puntos débiles',

        // Questions
        'questions.chooseHowToPractice': 'Elige cómo quieres practicar',
        'questions.selectModeToContinue': 'Selecciona un modo para continuar',
        'questions.questionBank': 'Banco de preguntas',
        'questions.practiceTopicWise': 'Practica preguntas por tema',
        'questions.exploreQuestions': 'Explorar preguntas',
        'questions.createSimulados': 'Crear simulados',
        'questions.buildCustomMockTest': 'Construye una prueba personalizada a tu manera',
        'questions.chooseSubject': 'Elegir materia',
        'questions.customiseYourSimulados': 'Personaliza tus simulados',
        'questions.allSubjects': 'Todas las materias',
        'questions.english': 'Inglés',
        'questions.mathematics': 'Matemáticas',
        'questions.science': 'Ciencias',
        'questions.history': 'Historia',
        'questions.geography': 'Geografía',
        'questions.numberOfQuestions': 'Número de pregunta',
        'questions.selectDifficulty': 'Seleccionar dificultad',
        'questions.tapToRevealAnswer': 'Toca para revelar la respuesta',
        'questions.correctAnswer': '🎉 Respuesta correcta',
        'questions.wrongAnswer': '❌ Respuesta incorrecta',
        'questions.heresSolution': '🧠 Aquí está la solución',
        'questions.explanation': 'Explicación:',
        'questions.skipExplanation': 'Omitir explicación',
        'questions.seeAnswer': 'Ver respuesta',
        'questions.why': '¿Por qué?',

        // Flashcards
        'flashcards.title': 'Tarjeta',
        'flashcards.savedFlashcards': 'Tarjetas guardadas',
        'flashcards.noSavedFlashcards': 'No hay tarjetas guardadas aún',
        'flashcards.noSavedFlashcardsDesc': 'No has guardado ninguna tarjeta. Guarda una para verla aquí.',
        'flashcards.tapToReveal': 'Toca para revelar la respuesta',
        'flashcards.tapToFlipBack': 'Toca para voltear',
        'flashcards.rename': 'Renombrar',
        'flashcards.remove': 'Quitar',
        'flashcards.delete': 'Eliminar',
        'flashcards.areYouSureDelete': '¿Estás seguro de que quieres eliminar este elemento?',

        // Notes
        'notes.title': 'Notas',
        'notes.savedNotes': 'Notas guardadas',
        'notes.noSavedNotes': 'No hay notas guardadas aún',
        'notes.noSavedNotesDesc': 'No has guardado ninguna nota. Comienza a guardar notas para verlas aquí.',
        'notes.uploadNotes': 'Subir notas',
        'notes.uploadDescription': 'Sube imágenes para crear nuevos conjuntos de estudio.',
        'notes.rename': 'Renombrar',
        'notes.remove': 'Quitar',
        'notes.delete': 'Eliminar',
        'notes.areYouSureDelete': '¿Estás seguro de que quieres eliminar este elemento?',

        // Library
        'library.title': 'Biblioteca',
        'library.savedLibrary': 'Biblioteca guardada',
        'library.noSavedLibrary': 'No hay biblioteca guardada aún',
        'library.noSavedLibraryDesc': 'No has guardado ninguna biblioteca. Guarda una para verla aquí.',
        'library.rename': 'Renombrar',
        'library.remove': 'Quitar',
        'library.delete': 'Eliminar',
        'library.areYouSureDelete': '¿Estás seguro de que quieres eliminar este elemento?',

        // Profile
        'profile.title': 'Perfil',
        'profile.editProfile': 'Editar perfil',
        'profile.savedNotes': 'Notas guardadas',
        'profile.savedFlashcards': 'Tarjetas guardadas',
        'profile.savedSummaries': 'Resúmenes guardados',
        'profile.achievements': 'Logros',
        'profile.mySubscription': 'Mi suscripción',
        'profile.termsConditions': 'Términos y condiciones',
        'profile.privacyPolicy': 'Política de privacidad',
        'profile.logout': 'Cerrar sesión',
        'profile.deleteAccount': 'Eliminar cuenta',
        'profile.preferredLanguage': 'Idioma preferido',
        'profile.notificationPreference': 'Preferencia de notificación',
        'profile.educationLevel': 'Nivel educativo:',
        'profile.name': 'Nombre',
        'profile.emailAddress': 'Dirección de correo',
        'profile.subscription.premiumPlan': 'Plan Premium',
        'profile.subscription.currentlySubscribed': 'Actualmente estás suscrito a Premium.',
        'profile.achievementsList.dayStreak': '¡Racha de 7 días!',
        'profile.achievementsList.moduleComplete': 'Módulo completo',
        'profile.achievementsList.star': '¡Eres una estrella!',
        'profile.confirmLogout': '¿Estás seguro de que quieres cerrar sesión de la aplicación?',
        'profile.confirmDelete': '¿Estás seguro de que quieres eliminar tu cuenta?',
        'profile.languageUpdated': 'Idioma actualizado',
        'profile.languageUpdateFailed': 'Falló la actualización del idioma',

        // Notifications
        'notifications.title': 'Notificación',
        'notifications.today': 'Hoy',
        'notifications.yesterday': 'Ayer',
        'notifications.projectAlphaDue': 'Proyecto Alfa vence mañana',
        'notifications.reviewWeakSpots': 'Revisa tus puntos débiles',
        'notifications.dailyQuizReady': '¡Tu cuestionario diario está listo! Practiquemos las áreas que necesitan un poco más de enfoque.',
        'notifications.progressImproved': '¡Mejoraste un +12% ayer! Sigue así',

        // Empty States
        'emptyStates.noData': 'No hay datos disponibles',
        'emptyStates.noResults': 'No se encontraron resultados',
        'emptyStates.nothingHere': 'Nada aquí todavía',
        'emptyStates.getStarted': 'Comienza agregando tu primer elemento',

        // Errors
        'errors.somethingWentWrong': 'Algo salió mal',
        'errors.networkError': 'Error de red. Por favor verifica tu conexión.',
        'errors.serverError': 'Error del servidor. Por favor intenta más tarde.',
        'errors.notFound': 'Página no encontrada',
        'errors.unauthorized': 'Acceso no autorizado',
        'errors.forbidden': 'Acceso prohibido',
        'errors.validationError': 'Error de validación',
        'errors.required': 'Este campo es requerido',
        'errors.invalidFormat': 'Formato inválido',
        'errors.tooShort': 'Demasiado corto',
        'errors.tooLong': 'Demasiado largo',
        'errors.emailInvalid': 'Dirección de correo inválida',
        'errors.passwordWeak': 'La contraseña es muy débil',
        'errors.fileTooBig': 'El archivo es muy grande',
        'errors.unsupportedFile': 'Formato de archivo no compatible',

        // Success
        'success.saved': 'Guardado exitosamente',
        'success.updated': 'Actualizado exitosamente',
        'success.deleted': 'Eliminado exitosamente',
        'success.uploaded': 'Subido exitosamente',
        'success.downloaded': 'Descargado exitosamente',
        'success.copied': 'Copiado al portapapeles',
        'success.moved': 'Movido exitosamente',
        'success.completed': 'Completado exitosamente',

        // Time
        'time.seconds': 'segundos',
        'time.minutes': 'minutos',
        'time.hours': 'horas',
        'time.days': 'días',
        'time.weeks': 'semanas',
        'time.months': 'meses',
        'time.years': 'años',
        'time.ago': 'hace',
        'time.fromNow': 'desde ahora',
        'time.justNow': 'justo ahora',
        'time.inAMoment': 'en un momento',

        'home.tasks.conceptExplanation': 'Explicación de concepto',
        'home.tasks.noTasksTitle': 'No hay tareas hoy',
        'home.tasks.noTasksSubtitle': 'Elige otra fecha o genera un nuevo plan para mantener tu racha.',
        'subscription.manage': 'Administrar suscripción',
        'subscription.checkPlanOverview': 'Consulta el resumen de tu plan:',
        'subscription.activeFrom': 'Activo desde',
        'subscription.expireOn': 'Expira el',
        'subscription.backToHome': 'Volver al inicio',
        'subscription.cancel': 'Cancelar suscripción',
        'subscription.free': 'Gratis',
        'subscription.monthly': 'Mensual',
        'subscription.yearly': 'Anual',
        'subscription.restore': 'Restaurar',
        'subscription.upgradeToPremium': 'Actualizar a premium',
        'limits.dailyQuestion': 'Se alcanzó el límite diario de preguntas.',
        'limits.dailyFlashcard': 'Se alcanzó el límite diario de tarjetas.',
        'limits.focusModePremium': 'El modo enfoque está disponible para usuarios premium',
        'achievements.new': 'Nuevo logro',
        'achievements.empty': 'Aún no hay logros disponibles.',
        'aiTutor.generateFlashcards': 'Generar tarjetas didácticas',
        'aiTutor.saveNotes': 'Guardar en notas',

        'subscription.your': 'Tu',

        'subscription.status': 'Estado',
        'subscription.statusDescription': 'Puedes explorar todas las funciones y contenido sin límites.',
        'subscription.trialDescription': 'Estás en un período de prueba gratuito. Se te cobrará después de que finalice.',

        'limits.weakSpotTracker': 'El rastreador de puntos débiles es una función premium.',
        'limits.flashcardLimit': 'Has usado todas las 12 tarjetas diarias. Actualiza a Premium para tarjetas ilimitadas.',

        'aiTutor.uploadImage': 'Subir imagen',
        'aiTutor.camera': 'Cámara',
        'aiTutor.gallery': 'Galería',
        'aiTutor.notesSaved': 'Notas guardadas exitosamente',
        'aiTutor.flashcardsGenerated': 'Tarjetas generadas exitosamente',
        'common.premiumFeature': 'Función Premium',
        'profile.saveToProfile': 'Guardar en perfil',
        'profile.notificationUpdated': 'Preferencia de notificación actualizada',
        'profile.notificationUpdateFailed': 'Error al actualizar la preferencia de notificación',
        'home.streak.consistencyMessage': 'La constancia construye el dominio. ¡Comencemos!',

        'quiz.q1': '¿Qué materia quieres aprender?',
        'quiz.q2': '¿Cuál es tu objetivo principal de aprendizaje?',
        'quiz.q3': '¿Cuál es tu estilo de aprendizaje?',
        'quiz.q4': '¿Cuánto tiempo puedes estudiar cada día?',
        'quiz.q5': '¿Cuándo prefieres estudiar?',
        'quiz.subject': 'Materia',
        'quiz.goal': 'Objetivo',
        'quiz.learningStyle': 'Estilo de aprendizaje',
        'quiz.startJourney': 'Comienza tu viaje de aprendizaje',
        'quiz.congratulations': '¡Felicitaciones! Tu plan de estudio está listo.',
        'quiz.writeSubjectHere': 'Escribe tu materia aquí',
        'quiz.option.english': 'Inglés',
        'quiz.option.mathematics': 'Matemáticas',
        'quiz.option.science': 'Ciencias',
        'quiz.option.history': 'Historia',
        'quiz.option.geography': 'Geografía',
        'quiz.option.computerScience': 'Informática / Programación',
        'quiz.option.business': 'Negocios / Economía',
        'quiz.option.languages': 'Idiomas',
        'quiz.option.other': 'Otro',
        'quiz.option.exam': 'Prepararse para un examen',
        'quiz.option.grades': 'Mejorar calificaciones',
        'quiz.option.newTopic': 'Aprender un tema nuevo desde cero',
        'quiz.option.mastery': 'Construir dominio a largo plazo',
        'quiz.option.revise': 'Repasar conocimientos previos',
        'quiz.option.consistency': 'Mejorar hábitos de estudio',
        'quiz.option.visual': 'Visual',
        'quiz.option.auditory': 'Auditivo',
        'quiz.option.reading': 'Lectura/Escritura',
        'quiz.option.kinesthetic': 'Kinestésico',
        'quiz.option.aiGuided': 'Guiado por IA',
        'quiz.option.less15': '<15 minutos',
        'quiz.option.15to30': '15-30 minutos',
        'quiz.option.30to60': '30-60 minutos',
        'quiz.option.1hour': '1 hora',
        'quiz.option.morning': 'Mañana',
        'quiz.option.afternoon': 'Tarde',
        'quiz.option.evening': 'Noche',
        'quiz.option.flexible': 'Flexible',

        'navbar.focusMode.on': 'ENFOCAR',
        'navbar.focusMode.off': 'APAGADO',
    },

    PORTUGUESE: {
        // Common
        'common.loading': 'Carregando...',
        'common.error': 'Erro',
        'common.success': 'Sucesso',
        'common.cancel': 'Cancelar',
        'common.save': 'Salvar',
        'common.delete': 'Excluir',
        'common.edit': 'Editar',
        'common.back': 'Voltar',
        'common.next': 'Próximo',
        'common.continue': 'Continuar',
        'common.finish': 'Finalizar',
        'common.close': 'Fechar',
        'common.confirm': 'Confirmar',
        'common.retry': 'Tentar novamente',
        'common.skip': 'Pular',
        'common.submit': 'Enviar',
        'common.tryAgain': 'Tentar novamente',
        'common.gotIt': 'Entendido',
        'common.done': 'Feito',
        'common.yes': 'Sim',
        'common.no': 'Não',
        'common.ok': 'OK',
        'common.search': 'Pesquisar',
        'common.filter': 'Filtrar',
        'common.clear': 'Limpar',
        'common.select': 'Selecionar',
        'common.all': 'Todos',
        'common.none': 'Nenhum',
        'common.other': 'Outro',
        'common.total': 'Total',
        'common.remaining': 'Restante',
        'common.progress': 'Progresso',
        'common.completed': 'Concluído',
        'common.pending': 'Pendente',
        'common.active': 'Ativo',
        'common.inactive': 'Inativo',
        'common.enabled': 'Habilitado',
        'common.disabled': 'Deshabilitado',
        'common.online': 'Online',
        'common.offline': 'Offline',
        'common.today': 'Hoje',
        'common.yesterday': 'Ontem',
        'common.tomorrow': 'Amanhã',
        'common.thisWeek': 'Esta semana',
        'common.lastWeek': 'Semana passada',
        'common.thisMonth': 'Este mês',
        'common.lastMonth': 'Mês passado',
        'common.thisYear': 'Este ano',
        'common.lastYear': 'Ano passado',
        'common.saving': 'Salvando',
        'common.generating': 'Gerando',
        'common.listening': 'Ouvindo',

        // Navigation
        'nav.home': 'Início',
        'nav.flashcards': 'Flashcards',
        'nav.notes': 'Notas',
        'nav.profile': 'Perfil',
        'nav.settings': 'Configurações',
        'nav.logout': 'Sair',
        'nav.login': 'Entrar',
        'nav.signup': 'Cadastrar',
        'nav.dashboard': 'Painel',
        'nav.library': 'Biblioteca',
        'nav.help': 'Ajuda',
        'nav.about': 'Sobre',
        'nav.contact': 'Contato',
        'nav.privacy': 'Política de privacidade',
        'nav.terms': 'Termos e condições',

        // Auth
        'auth.signIn': 'Entrar',
        'auth.signUp': 'Cadastrar',
        'auth.signOut': 'Sair',
        'auth.email': 'E-mail',
        'auth.password': 'Senha',
        'auth.confirmPassword': 'Confirmar senha',
        'auth.forgotPassword': 'Esqueceu sua senha?',
        'auth.resetPassword': 'Redefinir senha',
        'auth.createAccount': 'Criar conta',
        'auth.alreadyHaveAccount': 'Já tem uma conta?',
        'auth.dontHaveAccount': 'Não tem uma conta?',
        'auth.welcomeBack': 'Bem-vindo de volta',
        'auth.createYourAccount': 'Crie sua conta',
        'auth.enterYourEmail': 'Digite seu e-mail',
        'auth.enterYourPassword': 'Digite sua senha',
        'auth.rememberMe': 'Lembrar-me',
        'auth.invalidEmail': 'Endereço de e-mail inválido',
        'auth.passwordRequired': 'Senha é obrigatória',
        'auth.emailRequired': 'E-mail é obrigatório',
        'auth.passwordMismatch': 'As senhas não coincidem',
        'auth.loginSuccess': 'Login bem-sucedido',
        'auth.loginFailed': 'Falha no login',
        'auth.signupSuccess': 'Conta criada com sucesso',
        'auth.signupFailed': 'Falha na criação da conta',
        'auth.logoutSuccess': 'Sessão encerrada com sucesso',
        'auth.logoutFailed': 'Falha ao sair',

        // Onboarding
        'onboarding.welcome': 'Bem-vindo',
        'onboarding.chooseLanguage': 'Escolha seu idioma',
        'onboarding.chooseEducationLevel': 'Escolha seu nível educacional',
        'onboarding.placementQuiz': 'Teste de colocação',
        'onboarding.elementary': 'Fundamental',
        'onboarding.highSchool': 'Ensino médio',
        'onboarding.preUniversity': 'Pré-universitário',
        'onboarding.university': 'Universidade',
        'onboarding.competitiveExams': 'Exames competitivos',
        'onboarding.getStarted': 'Começar',
        'onboarding.skipForNow': 'Pular por enquanto',
        'onboarding.completeProfile': 'Complete seu perfil',
        'onboarding.almostDone': 'Quase pronto!',
        'onboarding.letsPersonalize': 'Vamos personalizar sua experiência',

        // Home
        'home.greeting.morning': 'Bom dia',
        'home.greeting.afternoon': 'Boa tarde',
        'home.greeting.evening': 'Boa noite',
        'home.readyToStart': 'Pronto para começar sua jornada de aprendizado hoje',
        'home.streak.startJourney': 'Que tal começar a sua sequência de estudos hoje? 🚀',
        'home.streak.studiedDays': 'Você está numa sequência de {count} dias! Continue assim! 🔥',
        'home.streak.keepItUp': 'O seu cérebro agradece a consistência. Cada dia conta!',
        'home.streak.milestone': 'Incrível! {count} dias seguidos de puro foco! 🧠⚡',
        'home.streak.milestoneSubtext': 'Você está oficialmente acima da média. Proteja a sua ofensiva!',
        'home.streak.days': 'dias',
        'home.tasks.todaysTask': 'Tarefa de hoje',
        'home.tasks.progress': 'Progresso',
        'home.tasks.noTasksScheduled': 'Nenhuma tarefa agendada',
        'home.tasks.completed': 'Concluído',
        'home.tasks.pending': 'Pendente',
        'home.aiTutor.ready': 'Seu tutor de IA está pronto para ajudar',
        'home.aiTutor.uploadNotes': 'Enviar notas',
        'home.aiTutor.uploadDescription': 'Envie imagens para criar novos conjuntos de estudo.',
        'home.aiTutor.askQuestion': 'Pergunte ao seu tutor IA',
        'home.questionBank.title': 'Banco de questões',
        'home.questionBank.exploreQuestions': 'Explorar questões',
        'home.questionBank.description': 'Pratique questões por tópico',
        'home.simulados.title': 'Crie seus próprios simulados',
        'home.simulados.description': 'Construa uma prova personalizada do seu jeito',
        'home.simulados.createSimulados': 'Criar simulados',
        'home.simulados.chooseSubject': 'Escolher matéria',
        'home.simulados.numberOfQuestions': 'Número de questões',
        'home.simulados.selectDifficulty': 'Selecionar dificuldade',
        'home.simulados.easy': 'Fácil',
        'home.simulados.medium': 'Médio',
        'home.simulados.hard': 'Difícil',
        'home.simulados.mix': 'Misto',
        'home.weakSpotTracker.title': 'Rastreador de pontos fracos',

        // Questions
        'questions.chooseHowToPractice': 'Escolha como você quer praticar',
        'questions.selectModeToContinue': 'Selecione um modo para continuar',
        'questions.questionBank': 'Banco de questões',
        'questions.practiceTopicWise': 'Pratique questões por tópico',
        'questions.exploreQuestions': 'Explorar questões',
        'questions.createSimulados': 'Criar simulados',
        'questions.buildCustomMockTest': 'Construa uma prova personalizada do seu jeito',
        'questions.chooseSubject': 'Escolher matéria',
        'questions.customiseYourSimulados': 'Personalize seus simulados',
        'questions.allSubjects': 'Todas as matérias',
        'questions.english': 'Inglês',
        'questions.mathematics': 'Matemática',
        'questions.science': 'Ciências',
        'questions.history': 'História',
        'questions.geography': 'Geografia',
        'questions.numberOfQuestions': 'Número de questão',
        'questions.selectDifficulty': 'Selecionar dificuldade',
        'questions.tapToRevealAnswer': 'Toque para revelar a resposta',
        'questions.correctAnswer': '🎉 Resposta correta',
        'questions.wrongAnswer': '❌ Resposta errada',
        'questions.heresSolution': '🧠 Aqui está a solução',
        'questions.explanation': 'Explicação:',
        'questions.skipExplanation': 'Pular explicação',
        'questions.seeAnswer': 'Ver resposta',
        'questions.why': 'Por quê?',

        // Flashcards
        'flashcards.title': 'Flashcard',
        'flashcards.savedFlashcards': 'Flashcards salvos',
        'flashcards.noSavedFlashcards': 'Nenhum flashcard salvo ainda',
        'flashcards.noSavedFlashcardsDesc': 'Você não salvou nenhum flashcard. Salve um para ver aqui.',
        'flashcards.tapToReveal': 'Toque para revelar a resposta',
        'flashcards.tapToFlipBack': 'Toque para virar',
        'flashcards.rename': 'Renomear',
        'flashcards.remove': 'Remover',
        'flashcards.delete': 'Excluir',
        'flashcards.areYouSureDelete': 'Tem certeza de que deseja excluir este item?',

        // Notes
        'notes.title': 'Notas',
        'notes.savedNotes': 'Notas salvas',
        'notes.noSavedNotes': 'Nenhuma nota salva ainda',
        'notes.noSavedNotesDesc': 'Você não salvou nenhuma nota. Comece a salvar notas para ver aqui.',
        'notes.uploadNotes': 'Enviar notas',
        'notes.uploadDescription': 'Envie imagens para criar novos conjuntos de estudo.',
        'notes.rename': 'Renomear',
        'notes.remove': 'Remover',
        'notes.delete': 'Excluir',
        'notes.areYouSureDelete': 'Tem certeza de que deseja excluir este item?',

        // Library
        'library.title': 'Biblioteca',
        'library.savedLibrary': 'Biblioteca salva',
        'library.noSavedLibrary': 'Nenhuma biblioteca salva ainda',
        'library.noSavedLibraryDesc': 'Você não salvou nenhuma biblioteca. Salve uma para ver aqui.',
        'library.rename': 'Renomear',
        'library.remove': 'Remover',
        'library.delete': 'Excluir',
        'library.areYouSureDelete': 'Tem certeza de que deseja excluir este item?',

        // Profile
        'profile.title': 'Perfil',
        'profile.editProfile': 'Editar perfil',
        'profile.savedNotes': 'Notas salvas',
        'profile.savedFlashcards': 'Flashcards salvos',
        'profile.savedSummaries': 'Resumos salvos',
        'profile.achievements': 'Conquistas',
        'profile.mySubscription': 'Minha assinatura',
        'profile.termsConditions': 'Termos e condições',
        'profile.privacyPolicy': 'Política de privacidade',
        'profile.logout': 'Sair',
        'profile.deleteAccount': 'Excluir conta',
        'profile.preferredLanguage': 'Idioma preferido',
        'profile.notificationPreference': 'Preferência de notificação',
        'profile.educationLevel': 'Nível educacional:',
        'profile.name': 'Nome',
        'profile.emailAddress': 'Endereço de e-mail',
        'profile.subscription.premiumPlan': 'Plano Premium',
        'profile.subscription.currentlySubscribed': 'Atualmente você está assinando o Premium.',
        'profile.achievementsList.dayStreak': 'Sequência de 7 dias!',
        'profile.achievementsList.moduleComplete': 'Módulo completo',
        'profile.achievementsList.star': 'Você é uma estrela!',
        'profile.confirmLogout': 'Tem certeza de que deseja sair do aplicativo?',
        'profile.confirmDelete': 'Tem certeza de que deseja excluir sua conta?',
        'profile.languageUpdated': 'Idioma atualizado',
        'profile.languageUpdateFailed': 'Falha na atualização do idioma',

        // Notifications
        'notifications.title': 'Notificação',
        'notifications.today': 'Hoje',
        'notifications.yesterday': 'Ontem',
        'notifications.projectAlphaDue': 'Projeto Alfa vence amanhã',
        'notifications.reviewWeakSpots': 'Revise seus pontos fracos',
        'notifications.dailyQuizReady': 'Seu questionário diário está pronto! Vamos praticar as áreas que precisam de um pouco mais de foco.',
        'notifications.progressImproved': 'Você melhorou +12% ontem! Continue assim',

        // Empty States
        'emptyStates.noData': 'Nenhum dado disponível',
        'emptyStates.noResults': 'Nenhum resultado encontrado',
        'emptyStates.nothingHere': 'Nada aqui ainda',
        'emptyStates.getStarted': 'Comece adicionando seu primeiro item',

        // Errors
        'errors.somethingWentWrong': 'Algo deu errado',
        'errors.networkError': 'Erro de rede. Por favor, verifique sua conexão.',
        'errors.serverError': 'Erro do servidor. Por favor, tente novamente mais tarde.',
        'errors.notFound': 'Página não encontrada',
        'errors.unauthorized': 'Acesso não autorizado',
        'errors.forbidden': 'Acesso proibido',
        'errors.validationError': 'Erro de validação',
        'errors.required': 'Este campo é obrigatório',
        'errors.invalidFormat': 'Formato inválido',
        'errors.tooShort': 'Muito curto',
        'errors.tooLong': 'Muito longo',
        'errors.emailInvalid': 'Endereço de e-mail inválido',
        'errors.passwordWeak': 'Senha muito fraca',
        'errors.fileTooBig': 'Arquivo muito grande',
        'errors.unsupportedFile': 'Formato de arquivo não suportado',

        // Success
        'success.saved': 'Salvo com sucesso',
        'success.updated': 'Atualizado com sucesso',
        'success.deleted': 'Excluído com sucesso',
        'success.uploaded': 'Enviado com sucesso',
        'success.downloaded': 'Baixado com sucesso',
        'success.copied': 'Copiado para a área de transferência',
        'success.moved': 'Movido com sucesso',
        'success.completed': 'Concluído com sucesso',

        // Time
        'time.seconds': 'segundos',
        'time.minutes': 'minutos',
        'time.hours': 'horas',
        'time.days': 'dias',
        'time.weeks': 'semanas',
        'time.months': 'meses',
        'time.years': 'anos',
        'time.ago': 'atrás',
        'time.fromNow': 'a partir de agora',
        'time.justNow': 'agora mesmo',
        'time.inAMoment': 'em um momento',

        'home.tasks.conceptExplanation': 'Explicação de conceito',
        'home.tasks.noTasksTitle': 'Nenhuma tarefa hoje',
        'home.tasks.noTasksSubtitle': 'Escolha outra data ou gere um novo plano para manter sua sequência.',
        'subscription.manage': 'Gerenciar assinatura',
        'subscription.checkPlanOverview': 'Verifique o resumo do seu plano:',
        'subscription.activeFrom': 'Ativo desde',
        'subscription.expireOn': 'Expira em',
        'subscription.backToHome': 'Voltar para a página inicial',
        'subscription.cancel': 'Cancelar assinatura',
        'subscription.free': 'Livre',
        'subscription.monthly': 'Mensal',
        'subscription.yearly': 'Anual',
        'subscription.restore': 'Restaurar',
        'subscription.upgradeToPremium': 'Atualizar para premium',
        'limits.dailyQuestion': 'Limite diário de perguntas atingido.',
        'limits.dailyFlashcard': 'Limite diário de flashcards atingido.',
        'limits.focusModePremium': 'O modo foco está disponível para usuários premium',
        'achievements.new': 'Nova Conquista',
        'achievements.empty': 'Nenhuma conquista disponível ainda.',
        'aiTutor.generateFlashcards': 'Gerar cartões flash',
        'aiTutor.saveNotes': 'Salvar nas notas',

        'subscription.your': 'Seu',

        'subscription.status': 'Status',
        'subscription.statusDescription': 'Você pode explorar todos os recursos e conteúdo sem limites.',
        'subscription.trialDescription': 'Você está em um período de teste gratuito. Você será cobrado após o término do teste.',

        'limits.weakSpotTracker': 'O rastreador de pontos fracos é um recurso premium.',
        'limits.flashcardLimit': 'Você usou todos os 12 flashcards diários. Atualize para Premium para flashcards ilimitados.',

        'aiTutor.uploadImage': 'Enviar imagem',
        'aiTutor.camera': 'Câmera',
        'aiTutor.gallery': 'Galeria',
        'aiTutor.notesSaved': 'Notas salvas com sucesso',
        'aiTutor.flashcardsGenerated': 'Flashcards gerados com sucesso',
        'common.premiumFeature': 'Recurso Premium',
        'profile.saveToProfile': 'Salvar no perfil',
        'profile.notificationUpdated': 'Preferência de notificação atualizada',
        'profile.notificationUpdateFailed': 'Falha ao atualizar preferência de notificação',
        'home.streak.consistencyMessage': 'Ative a sua mente e não deixe a chama apagar.',

        'quiz.q1': 'Qual matéria você quer aprender?',
        'quiz.q2': 'Qual é seu principal objetivo de aprendizado?',
        'quiz.q3': 'Qual é seu estilo de aprendizado?',
        'quiz.q4': 'Quanto tempo você pode estudar por dia?',
        'quiz.q5': 'Quando você prefere estudar?',
        'quiz.subject': 'Matéria',
        'quiz.goal': 'Objetivo',
        'quiz.learningStyle': 'Estilo de aprendizado',
        'quiz.startJourney': 'Comece sua jornada de aprendizado',
        'quiz.congratulations': 'Parabéns! Seu plano de estudos está pronto.',
        'quiz.writeSubjectHere': 'Escreva sua matéria aqui',
        'quiz.option.english': 'Inglês',
        'quiz.option.mathematics': 'Matemática',
        'quiz.option.science': 'Ciências',
        'quiz.option.history': 'História',
        'quiz.option.geography': 'Geografia',
        'quiz.option.computerScience': 'Informática / Programação',
        'quiz.option.business': 'Negócios / Economia',
        'quiz.option.languages': 'Idiomas',
        'quiz.option.other': 'Outro',
        'quiz.option.exam': 'Preparar para um exame',
        'quiz.option.grades': 'Melhorar notas',
        'quiz.option.newTopic': 'Aprender um novo tópico do zero',
        'quiz.option.mastery': 'Construir domínio a longo prazo',
        'quiz.option.revise': 'Revisar conhecimentos anteriores',
        'quiz.option.consistency': 'Melhorar hábitos de estudo',
        'quiz.option.visual': 'Visual',
        'quiz.option.auditory': 'Auditivo',
        'quiz.option.reading': 'Leitura/Escrita',
        'quiz.option.kinesthetic': 'Cinestésico',
        'quiz.option.aiGuided': 'Guiado por IA',
        'quiz.option.less15': '<15 minutos',
        'quiz.option.15to30': '15-30 minutos',
        'quiz.option.30to60': '30-60 minutos',
        'quiz.option.1hour': '1 hora',
        'quiz.option.morning': 'Manhã',
        'quiz.option.afternoon': 'Tarde',
        'quiz.option.evening': 'Noite',
        'quiz.option.flexible': 'Flexível',

        'navbar.focusMode.on': 'FOCO',
        'navbar.focusMode.off': 'DESLIGADO',
    },
} as const;

// Helper function to get translation
export const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    // Import here to avoid circular dependency
    const { useLanguageStore } = require('@/src/store/language.store');

    // Get current language from store
    const currentLanguage = useLanguageStore.getState().language as UserLanguage;

    // Get translation with proper typing
    const translation = translations[currentLanguage]?.[key] || translations.ENGLISH[key] || key;

    // Replace parameters if any
    if (params) {
        return Object.entries(params).reduce(
            (str: string, [param, value]) => str.replace(new RegExp(`{${param}}`, 'g'), String(value)),
            translation
        );
    }

    return translation;
};

// Helper to get all available languages
export const getAvailableLanguages = () => {
    return [
        { code: 'ENGLISH', name: 'English', flag: '/images/flags/us.svg' },
        { code: 'SPANISH', name: 'Español', flag: '/images/flags/es.svg' },
        { code: 'PORTUGUESE', name: 'Português', flag: '/images/flags/pt.svg' },
    ] as const;
};

// Helper to validate if a key exists
export const isValidTranslationKey = (key: string): key is TranslationKey => {
    return key in translations.ENGLISH;
};

// Export translations for type checking
export { translations };

export const useTranslation = () => {
    const language = useLanguageStore((s) => s.language);

    const translate = (key: TranslationKey, params?: Record<string, string | number>): string => {
        const translation = translations[language]?.[key] || translations.ENGLISH[key] || key;
        if (params) {
            return Object.entries(params).reduce(
                (str: string, [param, value]) => str.replace(new RegExp(`{${param}}`, 'g'), String(value)),
                translation
            );
        }
        return translation;
    };

    return { t: translate, language };
};
