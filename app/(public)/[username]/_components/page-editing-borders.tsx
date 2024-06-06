import { useAppSelector } from '@/lib/rtk-hooks';

const PageEditingBorders = () => {
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);

  return (
    isPageEditing && (
      <>
        <div className="edit-mode-line top-right z-[-1]"></div>
        <div className="edit-mode-line top-left z-[-1]"></div>
        <div className="edit-mode-line right-line z-[-1]"></div>
        <div className="edit-mode-line left-line z-[-1]"></div>
        <div className="edit-mode-line bottom-right z-[-1]"></div>
        <div className="edit-mode-line bottom-left z-[-1]"></div>
      </>
    )
  );
};

export default PageEditingBorders;
