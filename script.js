window.onload = () => {
	
	showAddColumnButton();
	showAddRowButton();
	
	const tds = document.querySelectorAll(".table td");
	tds.forEach((td) => td.addEventListener("mouseover", showButtons));
};

const showButtons = (() => {
	let rowIndex, colIndex;
	let deleteRowBtn, DeleteColBtn;
	let timeout;
	
	return (e) => {
		clearInterval(timeout);
		
		if(e.target.parentNode.parentNode.children.length > 1) {
			
			if(rowIndex !== e.target.parentNode.rowIndex) {
				//row changed
				try {
					hideButton(deleteRowBtn);
				} catch(e) {}
				
				rowIndex = e.target.parentNode.rowIndex;
				deleteRowBtn = showDeleteRowButton(e, rowIndex);
				
			}
		}
		
		if(e.target.parentNode.cells.length > 1) {
			//coll changed
			if(colIndex !== e.target.cellIndex) {
				try {
					hideButton(DeleteColBtn);
				} catch(e) {}
				
				colIndex = e.target.cellIndex;
				DeleteColBtn = showDeleteColumnButton(e, colIndex);
				
			}
		}
		
		timeout = setInterval(() => {
			hideButton(deleteRowBtn);
			hideButton(DeleteColBtn);
			rowIndex = colIndex = undefined;
		}, 2000);
	}
})();

function showAddColumnButton() {
	const table = document.querySelector(".table");
	
	const button = document.createElement("div");
	button.appendChild(document.createTextNode("+"));
	button.classList.add("btn-add");
	button.addEventListener("click", addColumn);
	
	document.getElementById("wrapper").appendChild(button);
	
	const tstyle = getComputedStyle(table);
	const td = table.querySelector("td");
	
	Object.assign(button.style, {
		right: `${parseInt(tstyle.marginRight) -
							td.offsetWidth -
							parseInt(tstyle.borderSpacing.split(" ")[0])
						}px`,
		top: `${parseInt(tstyle.marginTop) +
						parseInt(tstyle.borderTopWidth) +
						parseInt(tstyle.borderSpacing.split(" ")[1])
					}px`,
		width: td.offsetWidth + "px",
		height: td.offsetHeight + "px"
	});
}

function showAddRowButton() {
	const table = document.querySelector(".table");
	
	const button = document.createElement("div");
	button.appendChild(document.createTextNode("+"));
	button.classList.add("btn-add");
	button.addEventListener("click", addRow);
	
	document.getElementById("wrapper").appendChild(button);
	
	const tstyle = getComputedStyle(table);
	const td = table.querySelector("td");
	
	Object.assign(button.style, {
		bottom: `${	parseInt(tstyle.marginBottom) -
								td.offsetHeight -
								parseInt(tstyle.borderSpacing.split(" ")[0])
							}px`,
		left: `${	parseInt(tstyle.marginLeft) +
							parseInt(tstyle.borderLeftWidth) +
							parseInt(tstyle.borderSpacing.split(" ")[1])
						}px`,
		width: td.offsetWidth + "px",
		height: td.offsetHeight + "px"
	});
}

function showDeleteColumnButton(e, colIndex = -1) {
	e.stopPropagation();
	
	const table = document.querySelector(".table");
	const width = document.querySelector(".table td").offsetWidth;
	const height = document.querySelector(".table td").offsetHeight;
	const button = document.createElement("div");
	
	Object.assign(button.style, {
		width: `${width}px`,
		height: `${height}px`,
		left: `${table.offsetLeft + e.target.offsetLeft + 1}px`,
		top: `${table.offsetTop - e.target.offsetHeight - 1}px`,
		opacity: "0"
	});
	button.classList.add("btn-remove");
	button.appendChild(document.createTextNode("-"));
	
	document.getElementById("wrapper").appendChild(button);
	setTimeout(() => button.style.opacity = 1, 0);
	
	button.addEventListener("click", (e2) => {
		if(	colIndex >= table.querySelector("tr").children.length - 1 ||
				table.querySelector("tr").children.length - 1 === 1) {
			
			button.parentNode.removeChild(button);
		}
		deleteColumn(e2, colIndex);
	});
	
	return button;
}

function showDeleteRowButton(e, rowIndex = -1) {
	e.stopPropagation();
	
	const table = document.querySelector(".table");
	const width = document.querySelector(".table td").offsetWidth;
	const height = document.querySelector(".table td").offsetHeight;
	const button = document.createElement("div");
	
	Object.assign(button.style, {
		width: `${width}px`,
		height: `${height}px`,
		left: `${table.offsetLeft - e.target.offsetWidth - 1}px`,
		top: `${table.offsetTop + e.target.offsetTop + 1}px`,
		opacity: 0
	});
	button.classList.add("btn-remove");
	button.appendChild(document.createTextNode("-"));
	
	document.getElementById("wrapper").appendChild(button);
	setTimeout(() => button.style.opacity = 1, 0);
	
	button.addEventListener("click", (e2) => {
		if(rowIndex >= table.querySelectorAll("tr").length - 1 ||
				table.querySelectorAll("tr").length - 1 === 1) {
			button.parentNode.removeChild(button);
		}
		deleteRow(e2, rowIndex)
	});
	
	return button;
}

function hideButton(btn) {
	btn.style.opacity = "0";
	
	setTimeout(() => {
		if(btn.style.opacity == 0) {
			try {
				btn.parentElement.removeChild(btn);
			} catch(e) {}
		}
	}, 600);
}

function addColumn(e) {
	e.stopPropagation();
	
	const trs = document.querySelectorAll(".table tr");
	
	trs.forEach((tr) => {
		let td = document.createElement("td");
		td.addEventListener("mouseover", showButtons);
		
		tr.appendChild(td);
	});
}

function addRow() {
	const tr = document.querySelectorAll(".table tr")[0].cells;
	const _tr = document.createElement("tr");
	const table = document.querySelector(".table tbody");
	
	Array.prototype.forEach.call(tr, () => {
		let td = document.createElement("td");
		td.addEventListener("mouseover", showButtons);
		_tr.appendChild(td);
	});
	
	table.appendChild(_tr);
}

function deleteColumn(e, cellIndex) {
	e.stopPropagation();
	
	const table = document.querySelector(".table tbody");
	Array.prototype.forEach.call(
			table.children,
			(tr) => {
				Array.prototype.forEach.call(tr.cells, (td) => {
							if(td.cellIndex === cellIndex) {
								tr.removeChild(td);
							}
						}
				);
			}
	);
}

function deleteRow(e, rowIndex) {
	e.stopPropagation();
	
	const table = document.querySelector(".table tbody");
	let row;
	
	Array.prototype.forEach.call(
			table.children,
			(tr) => {
				if(tr.rowIndex === rowIndex) {
					row = tr;
				}
			}
	);
	
	table.removeChild(row);
}