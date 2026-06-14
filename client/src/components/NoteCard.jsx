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
                    📌
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
            <p className="text-gray-400 text-xs">
                {new Date(note.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <button
                    onClick={() => onEdit(note)}
                    className="flex-1 bg-blue-500 text-white 
                        py-1.5 rounded-lg hover:bg-blue-600 
                        text-sm font-medium transition"
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={() => onDelete(note._id)}
                    className="flex-1 bg-red-500 text-white 
                        py-1.5 rounded-lg hover:bg-red-600 
                        text-sm font-medium transition"
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
};

export default NoteCard;