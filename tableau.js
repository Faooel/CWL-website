document.getElementById('generateTablesButton').addEventListener('click', function() {
    document.getElementById('captain').play();
});

function createOptions(teams) {
    let options = '<option value="">Sélectionner une équipe</option>';
    teams.forEach(team => {
        options += `<option value="${team.nom}">${team.nom}</option>`;
    });
    return options;
}

function showTeams() {
    const eastSelection = document.getElementById('eastSelection');
    const westSelection = document.getElementById('westSelection');
    eastSelection.innerHTML = '';
    westSelection.innerHTML = '';

    for (let i = 0; i < 15; i++) {
        const selectionContainer = document.createElement('div');
        selectionContainer.className = 'selection-container';

        const placeText = document.createElement('span');
        placeText.className = 'place-text';
        placeText.textContent = `${i + 1}: `;
        selectionContainer.appendChild(placeText);

        const select = document.createElement('select');
        select.id = `eastTeam${i}`;
        select.classList.add('eastSelect');
        select.innerHTML = createOptions(teamsEastCWL);
        selectionContainer.appendChild(select);

        eastSelection.appendChild(selectionContainer);
    }

    for (let i = 0; i < 15; i++) {
        const selectionContainer = document.createElement('div');
        selectionContainer.className = 'selection-container';

        const placeText = document.createElement('span');
        placeText.className = 'place-text';
        placeText.textContent = `${i + 1}: `;
        selectionContainer.appendChild(placeText);

        const select = document.createElement('select');
        select.id = `westTeam${i}`;
        select.classList.add('westSelect');
        select.innerHTML = createOptions(teamsWestCWL);
        selectionContainer.appendChild(select);

        westSelection.appendChild(selectionContainer);
    }

    const eastSelects = document.querySelectorAll('.eastSelect');
    const westSelects = document.querySelectorAll('.westSelect');

    eastSelects.forEach((select, index) => {
        // Réinitialiser le style pour éviter les chevauchements
        select.style.backgroundColor = '';
        select.style.borderRadius = '10px';  // Appliquer un border-radius de 10px, vous pouvez ajuster la valeur

        if (index >= 0 && index <= 5) {  // Indices 0 à 5 (place 1 à 6)
            select.style.backgroundColor = '#a8e6a2';  // Vert clair
        } else if (index >= 6 && index <= 9) {  // Indices 6 à 9 (place 7 à 10)
            select.style.backgroundColor = '#fff3b0';  // Jaune clair
        } else if (index >= 10 && index <= 14) {  // Indices 10 à 14 (place 11 à 15)
            select.style.backgroundColor = '#f5a8a8';  // Rouge clair
        }
    });

    westSelects.forEach((select, index) => {
        // Réinitialiser le style pour éviter les chevauchements
        select.style.backgroundColor = '';
        select.style.borderRadius = '10px';  // Appliquer un border-radius de 10px, vous pouvez ajuster la valeur

        if (index >= 0 && index <= 5) {  // Indices 0 à 5 (place 1 à 6)
            select.style.backgroundColor = '#a8e6a2';  // Vert clair
        } else if (index >= 6 && index <= 9) {  // Indices 6 à 9 (place 7 à 10)
            select.style.backgroundColor = '#fff3b0';  // Jaune clair
        } else if (index >= 10 && index <= 14) {  // Indices 10 à 14 (place 11 à 15)
            select.style.backgroundColor = '#f5a8a8';  // Rouge clair
        }
    });

    updateEastOptions();
    updateWestOptions()

    westSelects.forEach(select => {
        select.addEventListener('change', updateWestOptions);
    })

    eastSelects.forEach(select => {
        select.addEventListener('change', updateEastOptions);
    })
    ;
}



showTeams();

function updateEastOptions() {
    const selectedValues = [...document.querySelectorAll('.eastSelect')].map(select => select.value);
    document.querySelectorAll('.eastSelect option').forEach(option => {
        if (option.value !== '') {
            option.disabled = selectedValues.includes(option.value);
        }
    });
}

function updateWestOptions() {
    const selectedValues = [...document.querySelectorAll('.westSelect')].map(select => select.value);
    document.querySelectorAll('.westSelect option').forEach(option => {
        if (option.value !== '') {
            option.disabled = selectedValues.includes(option.value);
        }
    });
}


function createTeamRows(teams, tableBody) {
    teams.forEach((team, index) => {
        const row = document.createElement('tr');

        if (index < 6) {
            row.style.backgroundColor = '#a8e6a2';
        } else if (index < 10) {
            row.style.backgroundColor = '#fff3b0';
        } else {
            row.style.backgroundColor = '#f5a8a8';
        }

        const placeCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const photoCell = document.createElement('td');
        const photo = document.createElement('img');

        placeCell.textContent = index + 1;
        nameCell.textContent = team ? team.nom : 'N/A';
        photo.src = team ? team.image : '';
        photo.alt = team ? team.nom : '';
        photo.width = 50;

        photoCell.appendChild(photo);
        row.appendChild(placeCell);
        row.appendChild(nameCell);
        row.appendChild(photoCell);
        tableBody.appendChild(row);
    });
}

document.getElementById('generateTablesButton').addEventListener('click', function() {
    const eastTeamsTableBody = document.querySelector('#eastTeamsTable tbody');
    const westTeamsTableBody = document.querySelector('#westTeamsTable tbody');

    eastTeamsTableBody.innerHTML = '';
    westTeamsTableBody.innerHTML = '';

    const selectedEastTeams = [];
    const selectedWestTeams = [];

    for (let i = 0; i < 15; i++) {
        const eastTeamName = document.getElementById(`eastTeam${i}`).value;
        const westTeamName = document.getElementById(`westTeam${i}`).value;

        const eastTeam = teamsEastCWL.find(team => team.nom === eastTeamName);
        const westTeam = teamsWestCWL.find(team => team.nom === westTeamName);

        selectedEastTeams.push(eastTeam);
        selectedWestTeams.push(westTeam);
    }

    createTeamRows(selectedEastTeams, eastTeamsTableBody);
    createTeamRows(selectedWestTeams, westTeamsTableBody);
});

document.getElementById('captureTablesButton').addEventListener('click', function() {
    const tablesContainer = document.getElementById('teamsContainer');
    html2canvas(tablesContainer).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'tables.png';
        link.click();
    });
});

document.getElementById('exportExcelButton').addEventListener('click', function() {
    const eastTeamsTable = document.getElementById('eastTeamsTable');
    const westTeamsTable = document.getElementById('westTeamsTable');

    const workbook = XLSX.utils.book_new();
    const eastSheet = XLSX.utils.table_to_sheet(eastTeamsTable);
    const westSheet = XLSX.utils.table_to_sheet(westTeamsTable);

    XLSX.utils.book_append_sheet(workbook, eastSheet, 'Conférence Est');
    XLSX.utils.book_append_sheet(workbook, westSheet, 'Conférence Ouest');

    XLSX.writeFile(workbook, 'teams.xlsx');
});

