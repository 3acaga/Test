window.onload = () => {
	
	new Controls();
};

class Controls {
	constructor() {
		this.table = document.querySelector(".table tbody");
		
		const tdStyle = getComputedStyle(this.table.querySelector("td"));
		const table = document.querySelector(".table");
		const removeRowButton = document.querySelector(".btn-remove__row");
		const removeCellButton = document.querySelector(".btn-remove__col");
		const wrapper = document.querySelector("#wrapper");
		
		const rowCount = this.table.children.length;
		const cellCount = this.table.firstElementChild.children.length;
		
		/////////////
		let row = 0;
		let cell = 0;
		/////////////
		
		this.rows = {
			count: rowCount,
			deleteBtn: removeRowButton,
			visible: rowCount > 1,
			
			baseY: parseInt(getComputedStyle(removeRowButton).top),
			stepY: (
					parseInt(tdStyle.height)
					+ 2 * parseInt(tdStyle.padding)
					+ parseInt(tdStyle.borderSpacing)
			),
		};
		Object.defineProperty(this.rows, "current", {
			get: () => row,
			set: (x) => {
				row = x;
				this.rows.deleteBtn.style.top = `${this.rows.baseY + row * this.rows.stepY}px`;
			}
		});
		
		this.cells = {
			count: cellCount,
			deleteBtn: removeCellButton,
			visible: cellCount > 1,
			
			baseX: parseInt(getComputedStyle(removeCellButton).left),
			stepX: (
					parseInt(tdStyle.width) +
					2 * parseInt(tdStyle.padding) +
					parseInt(tdStyle.borderSpacing)
			),
		};
		Object.defineProperty(this.cells, "current", {
			get: () => cell,
			set: (x) => {
				cell = x;
				this.cells.deleteBtn.style.left = `${this.cells.baseX + cell * this.cells.stepX}px`;
			}
		});
		
		document.querySelector(".btn-add__col").addEventListener("click", this.addColumn.bind(this));
		document.querySelector(".btn-add__row").addEventListener("click", this.addRow.bind(this));
		
		removeCellButton.addEventListener("click", this.deleteColumn.bind(this));
		removeRowButton.addEventListener("click", this.deleteRow.bind(this));
		
		table.addEventListener("mouseover", this.setIndices.bind(this));
		
		wrapper.addEventListener("mouseleave", this.hideButtons.bind(this));
		wrapper.addEventListener("mouseenter", this.showButtons.bind(this));
		
		table.addEventListener("mousedown", this.drag);
		
		table.ondragstart = () => false;
	}
	
	drag(e) {
		const table = e.currentTarget;
		const wrapper = table.parentNode;
		
		const {offsetTop: top, offsetLeft: left} = wrapper;
		const shiftX = e.pageX - left;
		const shiftY = e.pageY - top;
		
		const mouseMove = (e) => {
			wrapper.style.left = `${e.pageX - shiftX}px`;
			wrapper.style.top = `${e.pageY - shiftY}px`;
		};
		
		const clearListeners = (e) => {
			document.removeEventListener("mousemove", mouseMove);
			document.removeEventListener("mouseup", clearListeners);
		};
		
		document.addEventListener("mousemove", mouseMove);
		document.addEventListener("mouseup", clearListeners);
	}
	
	setIndices(e) {
		
		const row = e.target.parentNode.rowIndex;
		const cell = e.target.cellIndex;
		
		// if !table spacing
		if(row !== undefined && cell !== undefined) {
			this.rows.current = row;
			this.cells.current = cell;
		}
	}
	
	showButtons() {
		clearTimeout(this.timer);
		
		if(this.rows.visible) {
			this.rows.deleteBtn.style.display = "";
			this.rows.deleteBtn.style.opacity = 1;
		}
		
		if(this.cells.visible) {
			this.cells.deleteBtn.style.display = "";
			this.cells.deleteBtn.style.opacity = 1;
		}
	}
	
	hideButtons() {
		this.rows.deleteBtn.style.opacity = 0;
		this.cells.deleteBtn.style.opacity = 0;
		
		this.timer = setTimeout(() => {
			this.rows.deleteBtn.style.display = "none";
			this.cells.deleteBtn.style.display = "none";
		}, 600);
	}
	
	addColumn() {
		const trs = document.querySelectorAll(".table tr");
		
		trs.forEach((tr) => {
			let td = document.createElement("td");
			tr.appendChild(td);
		});
		
		this.cells.count++;
		this.cells.visible = this.cells.count > 1;
		
		this.cells.deleteBtn.style.display = "";
		this.cells.deleteBtn.style.opacity = 1;
	}
	
	addRow() {
		const cellCount = document.querySelector(".table tr").cells.length;
		
		
		const _tr = document.createElement("tr");
		
		for(let i = 0; i < cellCount; i++) {
			_tr.appendChild(document.createElement("td"));
		}
		
		this.table.appendChild(_tr);
		
		this.rows.count++;
		this.rows.visible = this.rows.count > 1;
		
		this.rows.deleteBtn.style.display = "";
		this.rows.deleteBtn.style.opacity = 1;
	}
	
	deleteColumn() {
		Array.prototype.forEach.call(
				this.table.children,
				(tr) => {
					Array.prototype.forEach.call(tr.cells, (td) => {
								if(td.cellIndex === this.cells.current) {
									tr.removeChild(td);
								}
							}
					);
				}
		);
		
		this.cells.count--;
		this.cells.visible = this.cells.count > 1;
		
		if(!this.cells.visible || this.cells.current > this.cells.count - 1) {
			this.cells.deleteBtn.style.display = "none";
			this.cells.current--;
		}
		
	}
	
	deleteRow() {
		Array.prototype.forEach.call(
				this.table.children,
				(tr) => {
					if(tr.rowIndex === this.rows.current) {
						this.table.removeChild(tr);
					}
				}
		);
		
		this.rows.count--;
		this.rows.visible = this.rows.count > 1;
		
		if(!this.rows.visible || this.rows.current > this.rows.count - 1) {
			this.rows.deleteBtn.style.display = "none";
			this.rows.current--;
		}
	}
}