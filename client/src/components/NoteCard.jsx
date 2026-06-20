import { FaEdit, FaTrash, FaThumbtack } from 'react-icons/fa';

const NoteCard = ({ note, onEdit, onDelete, onPin }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-5 
            flex flex-col gap-3 border-l-4 
            ${note.isPinned ? 'border-yellow-400' : 'border-blue-400'}`}>
            
            {/* Header */}
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-800 
                    flex-1 pr-2">
                    {note.title}
                </h3>
                <button
                    onClick={() => onPin(note._id)}
                    className={`text-xl ${note.isPinned ? 
                        'text-yellow-400' : 'text-gray-300'} 
                        hover:text-yellow-400 transition`}
                    title={note.isPinned ? 'Unpin' : 'Pin'}
                >
                    <FaThumbtack className="cursor-pointer text-yellow-500" />
                </button>
            </div>

            {/* Content */}
            <p className="text-gray-600 text-sm leading-relaxed
                line-clamp-3">
                {note.content}
            </p>

            {/* Tags */}
            {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-600 
                                text-xs px-2 py-1 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Date */}
{/* Date */}
<div className="text-gray-400 text-xs space-y-0.5">
    <p>
        Created: {new Date(note.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
    </p>

    {/* Only show "updated" if it's actually different from created */}
    {note.updatedAt && note.updatedAt !== note.createdAt && (
        <p>
            Edited: {new Date(note.updatedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}
        </p>
    )}
</div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <button
                    onClick={() => onEdit(note)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white 
                        py-1.5 rounded-lg hover:bg-blue-600 
                        text-sm font-medium transition"
                >
                     <FaEdit className="text-blue-500 hover:text-blue-700 text-lg" /> Edit
                </button>
                <button
                    onClick={() => onDelete(note._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white 
                        py-1.5 rounded-lg hover:bg-red-600 
                        text-sm font-medium transition"
                >
                    <FaTrash className="cursor-pointer text-red-500" /> Delete
                </button>
            </div>
        </div>
    );
};

export default NoteCard;