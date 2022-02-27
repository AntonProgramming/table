import './sheet.css'
import './info.js'

document.addEventListener('DOMContentLoaded', () => {
    const data = document.getElementById('data');
    const changeValue = document.getElementById('changeValue');
    const pages = document.getElementById('pages');
    const heading = ['Имя', 'Фамилия', 'Номер телефона', 'Описание', 'Цвет глаз'];
    const statecolumn = [false, false, false, false, false];// Required to draw columns, true - the column is hidden
    const headingCode = ['firstName', 'lastName', 'phone', 'about', 'eyeColor'];
    const amountOfRows = 10;
    const amountOfColumns = 5;
    let currentPage; // current page
  
    const view = function (n) { // pagination of data
      const thead = data.getElementsByTagName('thead')[0];
      data.removeChild(thead);
      const tbody = data.getElementsByTagName('tbody')[0];
      data.removeChild(tbody); // deleting the previous table to add a new one
  
      const theadOfData = document.createElement('thead');
      const trOfData = document.createElement('tr');
      for (let i = 0; i < amountOfColumns; i++) {
        if (!statecolumn[i]) {// checking if the column data needs to be displayed
          const thOfData = document.createElement('th');
          thOfData.className = 'heading';
          thOfData.innerHTML= heading[i]; 
          trOfData.appendChild(thOfData); 
        }
      }
      theadOfData.appendChild(trOfData);
      data.appendChild(theadOfData);
  
  
      const tbodyOfData = document.createElement('tbody');
  
      for (let i = n * amountOfRows; i <= (n + 1) * amountOfRows - 1; i++) { // pagination of data
        const trOfTbody  = document.createElement('tr');
        trOfTbody.className = 'row';
        const currentRow = columns(i); // JSON element for given position
        for (let j = 0; j < amountOfColumns; j++) {//
          const tdOfData = document.createElement('td');
          if (!statecolumn[j]) {
            if (j === 3) {
              tdOfData.className = 'about';
            } else if (j === 4) {
              tdOfData.className = currentRow[j];
            } 
            tdOfData.innerHTML = currentRow[j];
            trOfTbody.appendChild(tdOfData);
          }
        }
        tbodyOfData.appendChild(trOfTbody);
      }
      data.appendChild(tbodyOfData);
  
  
      const tbody2 = pages.getElementsByTagName('tbody')[0];
      pages.removeChild(tbody2);
      const tbodyOfPage = document.createElement('tbody');
      const trOfPage = document.createElement('tr');
      
      for (let i = 0; i < amountOfColumns; i++) {// drawing page numbers and highlighting the current page
        const indexx = i + 1;
        const thOfPage = document.createElement('th');

        if (i === n) {
          thOfPage.className = 'page currentPage';
        } else {
          thOfPage.className = 'page';
        }
        thOfPage.innerHTML = i+1;
        trOfPage.appendChild(thOfPage);
      }
      tbodyOfPage.appendChild(trOfPage);
      pages.appendChild(tbodyOfPage);
    };
  
    const columns = function (row) { // needed to output data through the loop
      const column = [info[row].name.firstName, info[row].name.lastName, info[row].phone, info[row].about, info[row].eyeColor];
      return column;
    };
  
    const changeRow = function (row) { // line edit fields
      let t = '';
      const currentRow = columns(row);
      for (let i = 0; i < amountOfColumns; i++) {
        t += `<p>${heading[i]}<Br>`;// column name
        t += `<textarea name='comment' cols='40' rows='1'>${currentRow[i]}</textarea></p>`;// Value that can be edited
      }
      changeValue.innerHTML += t;
    };
  
    const sorter1 = function (column, ret1, ret2) { // sorting for phone number, description and eye color
      info.sort((a, b) => {
        if (a.name[column] < b.name[column]) return ret1;
        if (a.name[column] > b.name[column]) return ret2;
        return 0;
      });
    };
  
    const sorter2 = function (column, ret1, ret2) { // sorter for first and last name
      info.sort((a, b) => {
        if (a[column] < b[column]) return ret1;
        if (a[column] > b[column]) return ret2;
        return 0;
      });
    };
  
    const remove = function(){//  deleting previously rendered elements of the editing window, it is necessary when moving from page to page or sorting, since the line being changed is no longer relevant
      while (changeValue.firstChild) {
        changeValue.removeChild(changeValue.firstChild);
      }
    }
  
    let state = true; //  true sort in ascending order, false - in descending order
    const sorter = function (index) { // JSON sort function
      remove(); 
      switch (index) { // index number of the column relative to which you want to sort
        case 0:
          if (state) {
            sorter1('firstName', -1, 1);
            state = false;
          } else {
            sorter1('firstName', 1, -1);
            state = true;
          }
          break;
        case 1:
          if (state) {
            sorter1('lastName', -1, 1);
            state = false;
          } else {
            sorter1('lastName', 1, -1);
            state = true;
          }
          break;
        case 2:
          if (state) {
            sorter2('phone', -1, 1);
            state = false;
          } else {
            sorter2('phone', 1, -1);
            state = true;
          }
          break;
        case 3:
          if (state) {
            sorter2('about', -1, 1);
            state = false;
          } else {
            sorter2('about', 1, -1);
            state = true;
          }
          break;
        case 4:
          if (state) {
            sorter2('eyeColor', -1, 1);
            state = false;
          } else {
            sorter2('eyeColor', 1, -1);
            state = true;
          }
          break;
        default:
          break;
      }
    };
  
    data.onclick = function (e) {
      if (e.target.tagName === 'TH') { // when clicking on the table header
        const cellIndex = event.target.cellIndex; // determine which column to sort
        sorter(cellIndex); 
        view(0); 
      } else if (e.target.tagName === 'TD') {// definition of the line to be edited
        const cellIndex2 = event.target.parentNode.rowIndex; // line number
        const choisenrow = currentPage * amountOfRows + cellIndex2;// determining the position of the desired element in JSON
        remove();
        changeRow(choisenrow - 1); // creating a new element
      } 
    };
  
    // pagination of data
    pages.onclick = function (e) {
      if (e.target.tagName != 'TH') {
        return;
      }
      currentPage = event.target.cellIndex; // definition of the current page, the currentPage variable is defined globally so that when sorting a column or hiding or showing, stay on the current page
      view(currentPage); 
      remove();
    };
  
  // checking chexbox states to hide or show table columns
    document.addEventListener('change', () => {
      const chk = event.target;
      if (chk.tagName === 'INPUT' && chk.type === 'checkbox') {
        for (let i = 0; i < amountOfColumns; i++) {
          if (chk.name === headingCode[i]) {
            statecolumn[i] = chk.checked;
          }
        }
        view(currentPage);
      }
    });
    view(0); //first page 
    currentPage = 0;
  });