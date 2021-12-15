;(function() {
	'use strict';
	let startGame = false;

	let isHandlerPlacement = false;
	
	let isHandlerController = false;
	// block players moves while comp is shooting
	let compShot = false;

	const getElement = id => document.getElementById(id);

	const getCoordinates = el => {
		const coords = el.getBoundingClientRect();
		return {
			left: coords.left + window.pageXOffset,
			right: coords.right + window.pageXOffset,
			top: coords.top + window.pageYOffset,
			bottom: coords.bottom + window.pageYOffset
		};
	};

	const humanfield = getElement('field_human');

	const computerfield = getElement('field_computer');

	class Field {

		static FIELD_SIDE = 330;

		static SHIP_SIDE = 33;

		static SHIP_DATA = {
			fourdeck: [1, 4],
			tripledeck: [2, 3],
			doubledeck: [3, 2],
			singledeck: [4, 1]
		};

		constructor(field) {
	
			this.field = field;

			this.squadron = {};

			this.matrix = [];

			let { left, right, top, bottom } = getCoordinates(this.field);
			this.fieldLeft = left;
			this.fieldRight = right;
			this.fieldTop = top;
			this.fieldBottom = bottom;
		}

		static createMatrix() {
			return [...Array(10)].map(() => Array(10).fill(0));
		}

		static getRandom = n => Math.floor(Math.random() * (n + 1));

		cleanField() {
			while (this.field.firstChild) {
				this.field.removeChild(this.field.firstChild);
			}
			this.squadron = {};
			this.matrix = Field.createMatrix();
		}

		randomLocationShips() {
			for (let type in Field.SHIP_DATA) {

				let count = Field.SHIP_DATA[type][0];

				let decks = Field.SHIP_DATA[type][1];

				for (let i = 0; i < count; i++) {
					let options = this.getCoordsDecks(decks);

					options.decks = decks;
					
					options.shipname = type + String(i + 1);
					
					const ship = new Ships(this, options);
					ship.createShip();
				}
			}
		}

		getCoordsDecks(decks) {
			

			let kx = Field.getRandom(1), ky = (kx == 0) ? 1 : 0,
				x, y;

			if (kx == 0) {
				x = Field.getRandom(9); y = Field.getRandom(10 - decks);
			} else {
				x = Field.getRandom(10 - decks); y = Field.getRandom(9);
			}

			const obj = {x, y, kx, ky}

			const result = this.checkLocationShip(obj, decks);

			if (!result) return this.getCoordsDecks(decks);
			return obj;
		}

		checkLocationShip(obj, decks) {
			let { x, y, kx, ky, fromX, toX, fromY, toY } = obj;


			fromX = (x == 0) ? x : x - 1;

			if (x + kx * decks == 10 && kx == 1) toX = x + kx * decks;

			else if (x + kx * decks < 10 && kx == 1) toX = x + kx * decks + 1;

			else if (x == 9 && kx == 0) toX = x + 1;

			else if (x < 9 && kx == 0) toX = x + 2;


			fromY = (y == 0) ? y : y - 1;
			if (y + ky * decks == 10 && ky == 1) toY = y + ky * decks;
			else if (y + ky * decks < 10 && ky == 1) toY = y + ky * decks + 1;
			else if (y == 9 && ky == 0) toY = y + 1;
			else if (y < 9 && ky == 0) toY = y + 2;

			if (toX === undefined || toY === undefined) return false;


			if (this.matrix.slice(fromX, toX)
				.filter(arr => arr.slice(fromY, toY).includes(1))
				.length > 0) return false;
			return true;
		}
	}	
})();
