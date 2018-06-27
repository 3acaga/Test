window.onload = () => {
	
	const tds = document.querySelectorAll(".table td");
	tds.forEach((td) => td.addEventListener("mouseover", showButtons));
};

function showButtons(e) {
	showAddRowButton(e);
	showAddColumnButton(e);
	
	if(e.target.parentNode.parentNode.children.length > 1) {
		showDeleteRowButton(e);
	}
	
	if(e.target.parentNode.cells.length > 1) {
		showDeleteColumnButton(e);
	}
}

function showAddColumnButton(e) {
	e.stopImmediatePropagation();
	
	const table = document.querySelector(".table");
	const width = document.querySelector(".table td").offsetWidth;
	const height = document.querySelector(".table td").offsetHeight;
	const button = document.createElement("div");
	
	Object.assign(button.style, {
		width: `${width}px`,
		height: `${height}px`,
		left: `${table.offsetLeft + table.offsetWidth + 1}px`,
		top: `${table.offsetTop + e.target.offsetTop + 1}px`,
		opacity: 0
	});
	button.appendChild(document.createTextNode("+"));
	button.classList.add("btn-add");
	button.addEventListener("click", addColumn);
	mountButton(button, e.target);
}

function showAddRowButton(e) {
	e.stopImmediatePropagation();
	
	const table = document.querySelector(".table");
	const width = document.querySelector(".table td").offsetWidth;
	const height = document.querySelector(".table td").offsetHeight;
	const button = document.createElement("div");
	
	Object.assign(button.style, {
		width: `${width}px`,
		height: `${height}px`,
		left: `${table.offsetLeft + e.target.offsetLeft + 1}px`,
		top: `${table.offsetTop + table.offsetHeight + 1}px`,
		opacity: 0
	});
	button.appendChild(document.createTextNode("+"));
	button.classList.add("btn-add");
	button.addEventListener("click", addRow);
	mountButton(button, e.target);
}

function showDeleteColumnButton(e) {
	e.stopImmediatePropagation();
	
	const table = document.querySelector(".table");
	const width = document.querySelector(".table td").offsetWidth;
	const height = document.querySelector(".table td").offsetHeight;
	const button = document.createElement("div");
	
	Object.assign(button.style, {
		width: `${width}px`,
		height: `${height}px`,
		left: `${table.offsetLeft + e.target.offsetLeft + 1}px`,
		top: `${table.offsetTop - e.target.offsetHeight - 1}px`,
		opacity: 0
	});
	button.appendChild(document.createTextNode("-"));
	button.classList.add("btn-remove");
	button.addEventListener("click", (e2) => deleteColumn(e2, e.target.cellIndex));
	mountButton(button, e.target);
}

function showDeleteRowButton(e) {
	e.stopImmediatePropagation();
	
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
	button.appendChild(document.createTextNode("-"));
	button.addEventListener("click", (e2) => deleteRow(e2, e.target.parentNode.rowIndex));
	button.classList.add("btn-remove");
	mountButton(button, e.target);
}

function hideButton(btn, timer) {
	clearInterval(timer);
	
	btn.addEventListener("mouseover", () => {
		clearInterval(fadeOut);
		btn.style.opacity = "1";
	});
	
	btn.addEventListener("mouseout", () => hideButton(btn));
	
	const fadeOut = setInterval(() => {
		if(btn.style.opacity < 0) {
			clearInterval(fadeOut);
			try {
				btn.parentElement.removeChild(btn);
			} catch(e) {
				clearInterval(fadeOut);
			}
		} else {
			btn.style.opacity = +btn.style.opacity - 0.10;
		}
	}, 10);
	
	//
}

function mountButton(button, target) {
	document.getElementById("wrapper").appendChild(button);
	
	const fadeIn = setInterval(() => {
		if(button.style.opacity >= 1) {
			clearInterval(fadeIn);
		}
		button.style.opacity = +button.style.opacity + 0.1;
	}, 10);
	
	target.addEventListener("mouseout", () => hideButton(button, fadeIn));
}

function addColumn(e) {
	e.stopPropagation();
	hideButton(e.target);
	
	const trs = document.querySelectorAll(".table tr");
	
	trs.forEach((tr) => {
		let td = document.createElement("td");
		td.addEventListener("mouseover", showButtons);
		
		tr.appendChild(td);
	});
}

function addRow(e) {
	e.stopPropagation();
	hideButton(e.target);
	
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
	hideButton(e.target);
	
	const table = document.querySelector(".table tbody");
	console.dir(table);
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
	hideButton(e.target);
	
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