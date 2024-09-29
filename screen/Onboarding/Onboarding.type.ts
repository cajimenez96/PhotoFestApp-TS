export type OnboardingProps = {
  setCompletedOnboarding: React.Dispatch<React.SetStateAction<string>>;
}

export type OnboardingButtonProps = {
  OnPress: () => void;
  content: "image" | "text",
  index: number,
}