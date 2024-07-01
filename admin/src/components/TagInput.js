
import React, { useState } from 'react';

const TagInput = ({ label, tags, setTags, name }) => {
    const [inputValue, setInputValue] = useState('');
  
    const handleAddTag = () => {
      if (inputValue && !tags.includes(inputValue)) {
        setTags([...tags, inputValue]);
        setInputValue('');
      }
    };
  
    const handleRemoveTag = (tagToRemove) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };
  
    return (
      <div>
        <label className="block mb-2 text-2xl font-medium text-gray-900 dark:text-white">{label}</label>
        <div className="flex flex-wrap items-center border border-gray-300 bg-gray-50 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {tag}
              <button type="button" className="ml-1" onClick={() => handleRemoveTag(tag)}>
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-grow bg-gray-50 border-none text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
            placeholder="Add ingredient"
          />
        </div>
      </div>
    );
  };

  export default TagInput;