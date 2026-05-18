interface StringListEditorProps {
  label?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function StringListEditor({
  label,
  items,
  onChange,
  placeholder = "Item text",
}: StringListEditorProps) {
  const update = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label ? <p className="text-sm font-medium text-gray-700">{label}</p> : null}
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="px-2 text-red-500 text-sm shrink-0"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-sm text-[#0798bc] hover:underline"
      >
        + Add item
      </button>
    </div>
  );
}
