export function TextInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400 ${className}`}
    />
  );
}
