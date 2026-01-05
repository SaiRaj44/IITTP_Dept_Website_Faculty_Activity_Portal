"use client";
import { useState } from "react";

interface ArrayFieldProps<T> {
  items: T[];
  onAdd: (item: T) => void;
  onRemove: (index: number) => void;
  itemLabel: string;
}

export interface Member {
  name: string;
  institute?: string;
}

const predefinedMembers: Member[] = [
  { name: "Dr. Sridhar Chimalakonda", institute: "dr-sridhar-chimalakonda" },
  {
    name: "Prof. Venkata Ramana Badarla",
    institute: "prof-venkata-ramana-badarla",
  },
  { name: "Dr. Kalidas Yeturu", institute: "dr-kalidas-yeturu" },
  { name: "Dr. Ajin George Joseph", institute: "dr-ajin-george-joseph" },
  { name: "Dr. Jayanaryana Tudu T", institute: "dr-jaynarayan-t-tudu" },
  { name: "Dr. V Mahendran", institute: "dr-v-mahendran" },
  { name: "Dr. Raghavendra Kanakagiri", institute: "dr-raghavendra-kanakagiri" },
  { name: "Dr. Raja S", institute: "dr-s-raja" },
  { name: "Dr. G Rama Krishna", institute: "dr-g-ramakrishna" },
  { name: "Dr. Chalavadi Vishnu", institute: "dr-chalavadi-vishnu" },
  { name: "Dr. Varsha Bhat Kukkala", institute: "dr-varsha-bhat-kukkala" },
];

export default function ArrayField<T extends Member>({
  items,
  onAdd,
  onRemove,
  itemLabel,
}: ArrayFieldProps<T>) {
  const [newItem, setNewItem] = useState<Member>({ name: "", institute: "" });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isCustomEntry, setIsCustomEntry] = useState<boolean>(false);

  const handleInputChange = (fieldName: keyof Member, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleAdd = () => {
    if (isCustomEntry) {
      if (newItem.name) {
        onAdd({ ...newItem } as T);
        setNewItem({ name: "", institute: "" });
      }
    } else if (selectedMembers.length > 0) {
      selectedMembers.forEach((memberName) => {
        const member = predefinedMembers.find((m) => m.name === memberName);
        if (member) {
          onAdd({ ...member } as T);
        }
      });
      setSelectedMembers([]);
    }
  };

  const handleMemberSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedMembers(selectedOptions);
  };

  return (
    <div className="space-y-4">
      {/* Display existing items */}
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <div className="text-sm">
              <span className="font-medium text-black">Name: {item.name}</span>
            </div>
            {item.institute && (
              <div className="text-sm">
                <span className="font-medium text-black">
                  ID: {item.institute}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add new item section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-900">Add {itemLabel}</h4>

        {/* Toggle between predefined and custom entry */}
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => {
              setIsCustomEntry(false);
              setNewItem({ name: "", institute: "" });
            }}
            className={`px-3 py-2 rounded-md ${
              !isCustomEntry
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Select Members
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCustomEntry(true);
              setSelectedMembers([]);
            }}
            className={`px-3 py-2 rounded-md ${
              isCustomEntry
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Custom Entry
          </button>
        </div>

        {isCustomEntry ? (
          // Custom entry form
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter name"
                className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID
              </label>
              <input
                type="text"
                value={newItem.institute || ""}
                onChange={(e) => handleInputChange("institute", e.target.value)}
                placeholder="Enter ID (optional)"
                className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        ) : (
          // Predefined members multi-select dropdown
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Members (Hold Ctrl/Cmd to select multiple)
            </label>
            <select
              multiple
              size={5}
              value={selectedMembers}
              onChange={handleMemberSelect}
              className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {predefinedMembers.map((member, index) => (
                <option key={index} value={member.name}>
                  {member.name} (ID: {member.institute})
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Selected: {selectedMembers.length} members
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={
            isCustomEntry ? !newItem.name : selectedMembers.length === 0
          }
          className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add{" "}
          {isCustomEntry
            ? itemLabel
            : `Selected Members (${selectedMembers.length})`}
        </button>
      </div>
    </div>
  );
}
