import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingData {
  userType: 'local' | 'tourist' | null;
  fullName: string;
  countryOfOrigin: string;
  durationOfStay: string;
  durationUnit: 'days' | 'weeks' | 'months';
  preferredLanguage: string;
  interests: string[];
  accommodationPreferences: string[];
  activityPreferences: string[];
  foodPreferences: string[];
  budgetRange: string;
  travelStyle: string[];
  locationPermissionGranted: boolean;
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboardingData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const defaultOnboardingData: OnboardingData = {
  userType: null,
  fullName: '',
  countryOfOrigin: '',
  durationOfStay: '',
  durationUnit: 'days',
  preferredLanguage: 'English',
  interests: [],
  accommodationPreferences: [],
  activityPreferences: [],
  foodPreferences: [],
  budgetRange: '',
  travelStyle: [],
  locationPermissionGranted: false,
  currentLocation: null,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6; // Total number of onboarding steps

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const resetOnboardingData = () => {
    setOnboardingData(defaultOnboardingData);
    setCurrentStep(0);
  };

  const value: OnboardingContextType = {
    onboardingData,
    updateOnboardingData,
    resetOnboardingData,
    currentStep,
    setCurrentStep,
    totalSteps,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}