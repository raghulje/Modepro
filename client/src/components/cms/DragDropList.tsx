import { useState } from 'react';

interface DragDropListProps<T> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

export default function DragDropList<T>({ 
  items, 
  onReorder, 
  renderItem, 
  keyExtractor,
  emptyMessage = 'No items yet. Add your first item!'
}: DragDropListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    // Update orderIndex for each item
    const reorderedItems = newItems.map((item: any, index) => ({
      ...item,
      orderIndex: index
    }));

    onReorder(reorderedItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <i className="ri-inbox-line text-4xl text-gray-400 mb-2"></i>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={keyExtractor(item)}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            transition-all duration-200 cursor-move
            ${draggedIndex === index ? 'opacity-50' : ''}
            ${dragOverIndex === index ? 'transform translate-y-2 border-blue-400' : ''}
          `}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-4 hover:shadow-md">
            <div className="text-gray-400 cursor-grab active:cursor-grabbing">
              <i className="ri-drag-move-2-line text-2xl"></i>
            </div>
            <div className="flex-1">
              {renderItem(item, index)}
            </div>
            <div className="text-xs text-gray-400 font-medium">
              #{index + 1}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

