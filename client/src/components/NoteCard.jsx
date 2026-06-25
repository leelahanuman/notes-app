import { FaEdit, FaTrash, FaThumbtack, FaStar, FaArchive } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

const NoteCard = ({ note, onEdit, onDelete, onPin,onFavorite,onReminder }) => {
  return (
    <div
      className={`
    bg-white dark:bg-gray-800
    rounded-2xl p-5 shadow-md
    hover:shadow-xl hover:-translate-y-1
    transition-all duration-300
    border-l-4
    ${note.isPinned ? "border-yellow-400" : "border-blue-500"}
  `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex-1 pr-2">
          {note.title}
        </h3>
<div className="flex gap-2">
<button
  onClick={() => onFavorite(note._id)}
  className={`p-2 rounded-full transition-all ${
    note.isFavorite
      ? "bg-yellow-100 text-yellow-500"
      : "bg-gray-100 text-gray-400 hover:text-yellow-500"
  }`}
>
  <FaStar />
</button>

  <button
    onClick={() => onPin(note._id)}
    className={`p-2 rounded-full ${
      note.isPinned
        ? "bg-yellow-100 text-yellow-500"
        : "bg-gray-100 text-gray-400 hover:text-yellow-500"
    }`}
  >
    <FaThumbtack />
  </button>
  <button
  onClick={() => onReminder(note)}
  className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white"
>
  <FaBell />
</button>
</div>
      </div>

      {/* Content */}
      <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-5">
        {note.content}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-600 border border-blue-200 text-xs px-3 py-1 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Date */}
      <p className="text-gray-400 text-xs mb-3">
        {new Date(note.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEdit(note)}
          className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
        >
          <FaEdit />
        </button>
<button
  onClick={() => onDelete(note._id)}
  title="Archive Note"
  className="p-3 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-all"
>
  <FaArchive />
</button>
      </div>
    </div>
  );
};

export default NoteCard;
