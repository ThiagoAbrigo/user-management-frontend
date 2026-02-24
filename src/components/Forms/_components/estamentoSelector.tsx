import { FiUsers } from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";

interface Props {
  selected: string;
  onSelect: (value: string) => void;
}

export const EstamentoSelector = ({ selected, onSelect }: Props) => {
  const options = [
    {
      id: "UNIVERSITARIO",
      label: "Estamento Universitario",
      desc: "Estudiantes, docentes y personal",
      icon: <HiOutlineAcademicCap size={24} />,
    },
    {
      id: "MIEMBRO EXTERNO",
      label: "Miembro Externo",
      desc: "Público en general",
      icon: <FiUsers size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {options.map((opt) => (
        <div
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-4 transition-all ${selected === opt.id
              ? "border-indigo-600 bg-indigo-600/10"
              : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
            }`}
        >
          <div className={`p-3 rounded-lg ${selected === opt.id ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
            {opt.icon}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm dark:text-white">{opt.label}</h4>
            <p className="text-xs text-gray-500">{opt.desc}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected === opt.id ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}>
            {selected === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
        </div>
      ))}
    </div>
  );
};