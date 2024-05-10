import { useState } from 'react';

const AUTOSAVE_DEBOUNCE_TIME = 2000;

type AutoSaveHookProps = {
  onSave: (formData: any) => void;
};

export const useAutoSave = ({ onSave }: AutoSaveHookProps) => {
  const [autoSaveTimer, setAutoSaveTimer] = useState<number | NodeJS.Timeout>(
    5000
  );

  const dispatchAutoSave = (formData: any) => {
    clearTimeout(autoSaveTimer);

    const timer = setTimeout(() => onSave(formData), AUTOSAVE_DEBOUNCE_TIME);

    setAutoSaveTimer(timer);
  };

  const triggerManualSave = (formData: any) => {
    clearTimeout(autoSaveTimer);
    onSave(formData);
  };

  return { dispatchAutoSave, triggerManualSave };
};
