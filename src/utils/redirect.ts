// import { useRedirect } from "@/src/hooks/router.hooks";

// export const handlePostLoginRedirect = (user: any) => {
//     console.log(user);
//   if (!user.user_language) {
//     useRedirect("/onboarding/choose-language", true);
//     return;
//   }

//   if (!user.user_EducationLevel) {
//     useRedirect("/onboarding/choose-education-level", true);
//     return;
//   }

//   if (!user.isPlacementQuizDone) {
//     useRedirect("/onboarding/placement-quize", true);
//     return;
//   }

//   useRedirect("/home", true);
// };


export const handlePostLoginRedirect = (user: any) => {
  console.log("Login user object:", user);

  if (!user.user_language) {
    window.location.replace("/onboarding/choose-language");
    return;
  }

  const hasEducationLevel = user.user_EducationLevel || user.educationLevelId || user.educationLevel;
  if (!hasEducationLevel) {
    window.location.replace("/onboarding/choose-education-level");
    return;
  }

  if (!user.isPlacementQuizDone) {
    window.location.replace("/onboarding/placement-quize");
    return;
  }

  window.location.replace("/home");
};