import { elements } from './utils';

export const renderItem = (item) => {
  const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
    <div class="shopping__count">
        <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
        <p>${item.unit}</p>
    </div>
    <p class="shopping__description">${item.ingredient}</p>
    <button class="shopping__delete btn-tiny">
        <svg>
        <title>circle-with-cross</title>
        <path d="M10 1.6c-4.639 0-8.4 3.761-8.4 8.4s3.761 8.4 8.4 8.4 8.4-3.761 8.4-8.4c0-4.639-3.761-8.4-8.4-8.4zM14.789 13.061l-1.729 1.729-3.060-3.061-3.061 3.060-1.729-1.729 3.062-3.060-3.061-3.061 1.729-1.728 3.060 3.060 3.061-3.061 1.729 1.729-3.062 3.061 3.061 3.061z"></path>        
        </svg>
    </button>
    </li>
    `;

  elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = (id) => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  if (item) item.parentElement.removeChild(item);
};
