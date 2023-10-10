import {sortStrings} from "../../02-javascript-data-types/1-sort-strings";

export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.columns = Object.keys(headerConfig).map(item => headerConfig[item].id);

    this.subElements = {header: this.#createHeaderTemplate(), body: this.#createBodyTemplate()};
    this.element = this.#createSortableTableElement();
  }

  #createHeaderCellElement(data) {
    const cell = document.createElement('div');
    cell.classList.add('sortable-table__cell');
    cell.setAttribute('data-id', data.id);
    cell.setAttribute('data-sortable', data.sortable);
    data.sortable ? cell.setAttribute('data-sortType', data.sortType) : null;

    cell.innerHTML = data.sortable ? `
        <span>${data.title}</span>
         <span data-element="arrow" class="sortable-table__sort-arrow">
         <span class="sort-arrow"></span>
        </span>
      `
      :
      `<span>${data.title}</span>`;

    return cell.outerHTML;
  }

  #createBodyCellElement(data, type) {
    let bodyCell = ``;

    if (type === 'images') {
      bodyCell += this.headerConfig.template ? headerConfig.template(data) : `
              <div class="sortable-table__cell">
                <img class="sortable-table-image" alt="Image" src="${data[0]?.url || 'https://via.placeholder.com/32'}">
              </div>
            `
    } else {
      bodyCell += `<div class="sortable-table__cell">${data}</div>`
    }

    return bodyCell;
  }

  #createCellsTemplate(type, data) {
    const dataKeys = Object.keys(data);
    let cellsTemplate = '';

    switch (type) {
      case('header'): {
        cellsTemplate = dataKeys.reduce((acc, key) => {
          acc += this.#createHeaderCellElement(data[key]);
          return acc;
        }, ``);
        break;
      }

      case('body'): {
        for (let item of this.columns) {
          cellsTemplate += this.#createBodyCellElement(data[item], item);
        }
        break;
      }

      default: {
        break;
      }
    }

    return cellsTemplate;
  }

  #createHeaderTemplate() {
    const header = document.createElement('div');
    header.classList.add('sortable-table__header', 'sortable-table__row');

    header.innerHTML = this.#createCellsTemplate('header', this.headerConfig);
    return header
  }

  #createBodyRowsTemplate() {
    return Object.keys(this.data).reduce((acc, item) => {
      const row = `
        <a href="/products/${this.data[item].id}" class="sortable-table__row">
            ${this.#createCellsTemplate('body', this.data[item])}
        </a>
      `
      acc += row;
      return acc;
    }, ``);
  }

  #createBodyTemplate() {
    const body = document.createElement('div');
    body.classList.add('sortable-table__body');
    body.setAttribute('data-element', 'body');
    body.innerHTML = this.#createBodyRowsTemplate();

    return body;
  }

  #createSortableTableElement() {
    const table = document.createElement('div');
    table.classList.add('sortable-table');

    table.append(this.subElements.header);
    table.append(this.subElements.body);

    return table;
  }

  #changeSortTarget(value, type) {
    const headers = this.subElements.header.querySelectorAll('.sortable-table__cell');

    headers.forEach(item => {
      if (item.dataset.id !== value) {
        item.removeAttribute('data-order')
      } else {
        item.setAttribute('data-order', type)
      }
    })
  }

  #updateElement(node) {
    const placement = node.dataset.element;
    this.subElements[placement] = node;

    this.element.querySelector(`[data-element=${placement}]`).replaceWith(this.subElements[placement]);
  }

  sort(value, type) {
    const sortValueType = this.subElements.header.querySelector(`[data-id=${value}]`).getAttribute('data-sortType');
    this.data = sortStrings(this.data, type, value, sortValueType);
    this.#changeSortTarget(value, type);

    this.#updateElement(this.#createBodyTemplate());
  }

  destroy() {
    this.element.remove()
  }

  remove() {
    this.element.remove();
  }
}
