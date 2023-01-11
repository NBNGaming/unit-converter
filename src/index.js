import { Converter } from './converter.js';

document.addEventListener('DOMContentLoaded', setup);
let lastEditedInput;

function setup() {
    // Основное окно
    selectCategory('weight');
    document.getElementById('category').onchange = function () {
        selectCategory(this.value);
    };
    document.getElementById('value1').oninput = updateInputs;
    document.getElementById('value2').oninput = updateInputs;
    document.getElementById('unit1').onchange = updateInputs;
    document.getElementById('unit2').onchange = updateInputs;

    // Модальные окна
    document.getElementById('showAddModal').onclick = () => {
        document.getElementById('converter').hidden = true;
        document.getElementById('addModal').hidden = false;
        document.getElementById('removeModal').hidden = true;
    };
    document.getElementById('showRemoveModal').onclick = () => {
        document.getElementById('converter').hidden = true;
        document.getElementById('addModal').hidden = true;
        document.getElementById('removeModal').hidden = false;

        const unitCount = document.getElementById('customUnit').childElementCount;
        document.getElementById('removeUnit').disabled = unitCount == 0;
    };
    Array.from(document.getElementsByClassName('cancel')).forEach(el => el.onclick = hideModals);

    // Окно "Добавить"
    selectCustomCategoryAdd('weight');
    document.getElementById('addUnit').onclick = addUnit;
    document.getElementById('customCategoryAdd').onchange = function () {
        selectCustomCategoryAdd(this.value);
    };

    // Окно "Удалить"
    selectCustomCategoryRemove('weight');
    document.getElementById('removeUnit').onclick = removeUnit;
    document.getElementById('customCategoryRemove').onchange = function () {
        selectCustomCategoryRemove(this.value);
    };
}

function hideModals() {
    document.getElementById('converter').hidden = false;
    Array.from(document.getElementsByClassName('modal')).forEach(el => el.hidden = true);
}

function selectCategory(category) {
    document.getElementById('value1').value = 1;
    document.getElementById('value2').value = 1;

    const options = new DocumentFragment();
    Converter.unitsInCategory(category).forEach((unitCode) => {
        options.append(new Option(Converter.units.get(unitCode).label, unitCode));
    });
    document.getElementById('unit1').replaceChildren(options.cloneNode(true));
    document.getElementById('unit2').replaceChildren(options);
}

function selectCustomCategoryAdd(category) {
    document.getElementById('customLabel').value = '';
    document.getElementById('customValue').value = 1;
    const baseUnit = document.getElementById('baseUnit');
    switch (category) {
        case 'weight':
            baseUnit.innerText = ' г';
            break;
        case 'volume':
            baseUnit.innerText = ' мл';
            break;
    }
}

function selectCustomCategoryRemove(category) {
    const options = new DocumentFragment();
    const units = Converter.unitsInCategory(category).filter(code => localStorage.getItem(code));
    units.forEach((unitCode) => {
        options.append(new Option(Converter.units.get(unitCode).label, unitCode));
    });
    document.getElementById('customUnit').replaceChildren(options);
    document.getElementById('removeUnit').disabled = units.length == 0;
}

function updateInputs() {
    if (this.tagName == 'INPUT') lastEditedInput = this;

    let fromValue, fromUnit, toValue, toUnit;
    if ((lastEditedInput === undefined && this.id == 'unit1') || lastEditedInput?.id == 'value1') {
        fromValue = document.getElementById('value1').value;
        fromUnit = document.getElementById('unit1').value;
        toValue = document.getElementById('value2');
        toUnit = document.getElementById('unit2').value;
    } else {
        fromValue = document.getElementById('value2').value;
        fromUnit = document.getElementById('unit2').value;
        toValue = document.getElementById('value1');
        toUnit = document.getElementById('unit1').value;
    }
    toValue.value = Converter.convert(fromUnit, fromValue, toUnit);
}

function addUnit() {
    const label = document.getElementById('customLabel').value.trim();
    const value = Number(document.getElementById('customValue').value);
    const category = document.getElementById('customCategoryAdd').value;

    if (label == '' || isNaN(value) || value == 0) {
        alert('Заполните все поля!');
        return;
    }

    const unitCode = Converter.addCustomUnit(label, value, category);
    const option = new Option(label, unitCode);
    if (document.getElementById('category').value == category) {
        document.getElementById('unit1').append(option.cloneNode(true));
        document.getElementById('unit2').append(option.cloneNode(true));
    }
    if (document.getElementById('customCategoryRemove').value == category) {
        document.getElementById('customUnit').append(option);
    }

    hideModals();
}

function removeUnit() {
    const unitCode = document.getElementById('customUnit').value;
    Converter.removeCustomUnit(unitCode);
    Array.from(document.querySelectorAll(`.units > option[value="${unitCode}"]`)).forEach(el => el.remove());
    hideModals();
}