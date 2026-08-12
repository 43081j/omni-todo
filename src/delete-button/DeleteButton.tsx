export interface DeleteButtonProps {
  label: string;
  disabled: boolean;
  onDelete: () => void;
}

export const DeleteButton = (props: DeleteButtonProps) => {
  const { label, disabled, onDelete } = props;

  return (
    <button
      type="button"
      part="button"
      aria-label={label}
      disabled={disabled}
      onClick={onDelete}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
          d="M3 3.5 L13 13.5 M13 3.5 L3 13.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};
