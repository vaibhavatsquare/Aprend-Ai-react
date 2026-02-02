import { useRedirect } from "@/src/hooks/router.hooks";

export const handlePostLoginRedirect = (user: any) => {
    console.log(user);
  if (!user.user_language) {
    useRedirect("/onboarding/choose-language", true);
    return;
  }

  if (!user.user_EducationLevel) {
    useRedirect("/onboarding/choose-education-level", true);
    return;
  }

  if (!user.isPlacementDone) {
    useRedirect("/onboarding/placement-quize", true);
    return;
  }
  
  useRedirect("/home", true);
};
