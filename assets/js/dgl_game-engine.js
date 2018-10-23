// -- GAME OBJECT --
let DinoGameLike = class
{
	constructor()
	{
		this.refreshGameLoop;
		this.canvasList = [];
		this.timeStart;
		this.speed = 1;

		this.plxGoal =
		{
			img: createElem("img", "src", "assets/img/goal.svg"),
			posX: 0,
			posY: 1,
			speedZ: 6,
			width: 40,
			height: 200,
			heightRatio: 20,
			active: false		
		}

		this.plxRoad = 
		{
			img: createElem("img", "src", "assets/img/road.svg"),
			posX: 0,
			posY: 1,
			speedZ: 6,
			width: 1280,
			height: 200,
			heightRatio: 20
		};
		this.plxForest = 
		{
			img: createElem("img", "src", "assets/img/forest.svg"),
			posX: 0,
			posY: 1,
			speedZ: 6,
			width: 1280,
			height: 200,
			heightRatio: 33
		};
		this.plxMountainsA = 
		{
			img: createElem("img", "src", "assets/img/mountains_a.svg"),
			posX: 0,
			posY: 1,
			speedZ: 3,
			width: 1280,
			height: 640,
			heightRatio: 75
		};
		this.plxMountainsB = 
		{
			img: createElem("img", "src", "assets/img/mountains_b.svg"),
			posX: 0,
			posY: 1,
			speedZ: 2,
			width: 1280,
			height: 640,
			heightRatio: 75
		};
		this.plxClouds = 
		{
			img: createElem("img", "src", "assets/img/clouds.svg"),
			posX: 0,
			posY: 0,
			speedZ: 1,
			width: 1280,
			height: 640,
			heightRatio: 75
		};
		this.parallax = [this.plxRoad, this.plxForest, this.plxMountainsA, this.plxMountainsB, this.plxClouds];

		this.player = 
		{
			img: [createElem("img", "src", "assets/img/bike01.svg"), createElem("img", "src", "assets/img/bike02.svg"), createElem("img", "src", "assets/img/bike03.svg"), createElem("img", "src", "assets/img/bike04.svg")],
			currentImgIndex: 0,
			imgEveryFrame: 0,
			posX: 0,
			posY: 0,
			floorPosY: 0,
			jump: 0,
			jumpImg: createElem("img", "src", "assets/img/bikeJump.svg"),
			jumpStep: 0,
			jumpInertieMaxPosY: 0,
			jumpMaxPosY: 0,
			width: 1280,
			height: 720
		};

		this.obsCowImg = createElem("img", "src", "assets/img/cow.svg");
		this.obsCow =
		{
			img: this.obsCowImg,
			posX: 0,
			posY: 0,
			width: 64,
			height: 48,
			heightOrigin: 48,
			elemType: "floor"
		};

		this.obsCowV02Img = createElem("img", "src", "assets/img/cow_v02.svg");
		this.obsCowV02 =
		{
			img: this.obsCowV02Img,
			posX: 0,
			posY: 0,
			width: 78,
			height: 74,
			heightOrigin: 74,
			elemType: "floor"
		};

		this.obsBalloonImg = createElem("img", "src", "assets/img/balloon.svg");
		this.obsBalloon =
		{
			img: this.obsBalloonImg,
			posX: 0,
			posY: 0,
			width: 42,
			height: 64,
			heightOrigin: 64,
			elemType: "fly"
		};

		this.obstacles = [this.obsCow, this.obsCowV02, this.obsBalloon];
		this.currentObstacles = [];
		this.obsCreateEveryFrame = 0;

		this.itemsList = 
		[
			this.apple = 
			{
				img: createElem("img", "src", "assets/img/apple.svg"),
				alt: "pomme",
				co2: -10,
				posX: 0,
				posY: 0,
				width: 33,
				height: 33,
				heightOrigin: 33,
				elemType: "floor"
			},
			this.bottle = 
			{
				img: createElem("img", "src", "assets/img/bottle.svg"),
				alt: "bouteille d'eau",
				co2: 10,
				posX: 0,
				posY: 0,
				width: 33,
				height: 33,
				heightOrigin: 33,
				elemType: "floor"
			},
			/*this.flask = 
			{
				img: createElem("img", "src", "assets/img/flask.svg"),
				alt: "gourde",
				co2: -10,
				posX: 0,
				posY: 0,
				width: 33,
				height: 33,
				elemType: "floor"
			},
			this.beef = 
			{
				img: createElem("img", "src", "assets/img/beef.svg"),
				alt: "morceau de boeuf",
				co2: 10,
				posX: 0,
				posY: 0,
				width: 33,
				height: 33,
				elemType: "floor"
			},
			this.kiwi = 
			{
				img: createElem("img", "src", "assets/img/kiwi.svg"),
				alt: "kiwi",
				co2: 10,
				posX: 0,
				posY: 0,
				width: 33,
				height: 33,
				elemType: "floor"
			}*/
		];
		this.itemCreateEveryFrame = 0;
		this.nextItem = "";
		this.currentItems = [];


		this.score = 0;
		this.endOfGame = false;

		this.frameBySec = 60;
		this.frameBySecTimeStart;

		this.UIInfos = [];
	}

	countTime(timeStart, milliSec)
	{
		let currentTime = new Date().getTime();

		if ((currentTime - timeStart) >= milliSec || typeof timeStart == "undefined")
		{
			return new Date().getTime();
		}
		else
		{
			return timeStart;
		}
	}

	calculFrameBySec()
	{
		let frameBySecTimeStart = this.frameBySecTimeStart;
		this.frameBySecTimeStart = this.countTime(this.frameBySecTimeStart, 1000);
		if (frameBySecTimeStart != this.frameBySecTimeStart)
		{
			console.log(this.frameBySec);
			this.frameBySec = 0;
		}
		this.frameBySec += 1;
	}

	updateCo2Metter(points)
	{
		let dglCOMetter = document.getElementById("dglCOMetter");
		let dglCOValue = document.getElementById("dglCOValue");
		let newCOScore = parseInt(dglCOValue.innerText ,10) + points;
		if (newCOScore >= 100)
		{
			newCOScore = 100;
		}
		else if (newCOScore <= 0)
		{
			newCOScore = 0;
		}
		dglCOValue.innerText = newCOScore;
		newCOScore /= 100;
		dglCOMetter.style.transform = "scaleX("+newCOScore+")";
	}

	updateInteractiveElements(elem)
	{
		let ratio = elem.width / elem.height;
		elem.height = (this.canvasList[0].canvas.height / 100) * (elem.heightOrigin / 100) * 18;
		elem.width = elem.height * ratio;
		if (elem.elemType == "floor")
		{
			elem.posY = this.player.floorPosY + this.player.height - elem.height;
		}
		else
		{
			elem.posY = this.player.floorPosY - (this.player.height * 2);
		}
	}

	loadNextItem()
	{
		let nextItemIndex = Math.floor((Math.random() * (this.itemsList.length)) + 0);
		this.nextItem = this.itemsList[nextItemIndex];
		this.itemsList.splice(nextItemIndex, 1);

		let dglNextItemContainer = document.getElementById("dglNextItemContainer")
		dglNextItemContainer.appendChild(this.nextItem.img);
		let dglNextItemImg = dglNextItemContainer.querySelector("img");
		dglNextItemImg.setAttribute("id", "dglNextItemImg");
		dglNextItemImg.setAttribute("class", "dglNextItemImg");
		dglNextItemImg.setAttribute("alt", this.nextItem.alt);
	}

	createItem()
	{
		if (this.itemCreateEveryFrame >= 600)
		{
			this.obsCreateEveryFrame = 0;	
			this.itemCreateEveryFrame = 0;	
			if (this.plxGoal.active == false)
			{
				let dglNextItemImg = document.getElementById("dglNextItemImg");
				dglNextItemImg.remove();
				this.nextItem.posX = this.canvasList[0].canvas.width;
				let randPosY = Math.floor((Math.random() * 2) + 1);
				if (randPosY === 1)
				{
					this.nextItem.elemType = "floor";
				}
				else
				{
					this.nextItem.elemType = "fly";
				}
				this.updateInteractiveElements(this.nextItem);
				this.currentItems.push(this.nextItem);
				if (this.itemsList.length > 0)
				{
					this.loadNextItem();
				}
				else
				{
					this.plxGoal.active = "waitNextCycle";
				}
			}
			else
			{
				this.plxGoal.active = true;
				this.plxGoal.posX = this.canvasList[0].canvas.width;
			}
		}
		else
		{
			this.itemCreateEveryFrame += 1;
		}
	}

	createObstacle()
	{
		if (this.obsCreateEveryFrame >= 60)
		{
			// 2 chance out of 3 to create an obstacle
			if  (Math.floor((Math.random() * 3) + 1) <= 2)
			{
				// rand obstacle type
				let randIndex = Math.floor((Math.random() * (this.obstacles.length)) + 0);
				let obstacle = Object.create(this.obstacles[randIndex]);
				obstacle.posX = this.canvasList[0].canvas.width;
				this.updateInteractiveElements(obstacle);
				this.currentObstacles.push(obstacle);
			}
			this.obsCreateEveryFrame = 0;				
		}
		else
		{
			this.obsCreateEveryFrame += 1;
		}
	}

	deleteUiText()
	{
		let UIText = this.UIInfos;

		for (let i = UIText.length - 1; i >= 0; i--)
		{
			UIText[i].birthDate += 1;
			if (UIText[i].birthDate === 15)
			{
				UIText[i].tag.style.transform = "translateY(-2000%)";
			}
			else if (UIText[i].birthDate >= 120)
			{
				UIText[i].tag.remove();
				UIText.splice(i, 1);
			}
		}
	}

	createUiText(elem, elemType)
	{
		if (elemType == "item")
		{
			let tag;
			if (elem.co2 > 0)
			{
				tag = createElem("p", "class", "dglUiInfos dglSmsRed");
				tag.innerText = "+10 de CO2";
			}
			else
			{
				tag = createElem("p", "class", "dglUiInfos dglSmsGreen");
				tag.innerText = "-10 de CO2";				
			}
			tag.style.left = elem.posX + "px";
			tag.style.top = elem.posY + "px";
			document.getElementById("dglUIContainer").appendChild(tag);
			this.UIInfos.push({tag: tag, birthDate: 0});
		}
	}

	checkCollisions(elem, elementType)
	{
		let p = this.player;
		let pLeft = this.player.posX;
		let pRight = this.player.posX + this.player.width;
		let pTop = this.player.posY;
		let pBottom = this.player.posY + this.player.height;

		// dummy collisions (dummy surface = 10% obstacle image)
		let dWidth = (elem.width / 100) * 2;
		let dHeight = (elem.height / 100) * 2;
		let dLeft = elem.posX + (elem.width / 2) - (dWidth / 2);
		let dRight = dLeft + dWidth;
		let dTop = elem.posY + (elem.height / 2) - (dHeight / 2);
		let dBottom = dTop + dHeight;

		if ((pLeft >= dLeft && pLeft < dRight && pTop >= dTop && pTop < dBottom) || (dLeft >= pLeft && dLeft < pRight && dTop >= pTop && dTop < pBottom) || (pRight >= dLeft && pRight < dRight && pBottom >= dTop && pBottom < dBottom) || (dRight >= pLeft && dRight < pRight && dBottom >= pTop && dBottom < pBottom))
		{
			this.createUiText(elem, elementType);
			return true;
		}
	}

	drawInteractiveElements(list, elementType)
	{
		for (let i = list.length - 1; i >= 0; i--)
		{
			let elem = list[i];
			elem.posX -= this.speed * this.plxRoad.speedZ;
			this.canvasList[0].drawImage(elem.img, elem.posX, elem.posY, elem.width, elem.height);
			// collisions
			let colTest = this.checkCollisions(elem, elementType);
			if (colTest === true)
			{
				if (elementType == "item")
				{				
					this.updateCo2Metter(elem.co2);
				}
				else
				{
					this.gameOver();
				}
			}
			// delete obstacle if it goes out of the screen by the left || if item touch the player
			if (elem.posX + elem.width < 0 || (elementType === "item" && colTest === true))
			{
				list.splice(i, 1);
			}
		}
	}

	drawGoal()
	{
		if (this.plxGoal.active === true)
		{
			this.canvasList[0].drawImage(this.plxGoal.img, this.plxGoal.posX + this.plxGoal.width, this.plxGoal.posY, this.plxGoal.width, this.plxGoal.height);
			this.plxGoal.posX -= this.speed * this.plxGoal.speedZ;

			if (this.player.posX >= this.plxGoal.posX)
			{
				this.win();
			}
		}
	}

	drawParallax()
	{
		let plx = this.parallax;
		for (let i = plx.length - 1; i >= 0; i--)
		{
			if (-1 * plx[i].posX < plx[i].width)
			{
				plx[i].posX -= this.speed * plx[i].speedZ;
			}
			else
			{
				plx[i].posX = -this.speed * plx[i].speedZ;
			}

			this.canvasList[0].drawImage(plx[i].img, plx[i].posX, plx[i].posY, plx[i].width, plx[i].height);
			
			// repeat img to fill canvas
			let numberOfInstance = Math.ceil(this.canvasList[0].canvas.width / (plx[i].width));
			for (let j = 0; j < numberOfInstance; j++)
			{
				let shift = j * plx[i].width;
				this.canvasList[0].drawImage(plx[i].img, plx[i].posX + plx[i].width + shift - 1, plx[i].posY, plx[i].width, plx[i].height);
			}
		}
	}

	playerJump()
	{
		// jump intensity
		if (this.player.jump === 2)
		{
			let jumpInertieMaxPosY = this.player.posY - (10 * this.player.jumpStep);
			this.player.jump = 1;
			if (jumpInertieMaxPosY > this.player.jumpMaxPosY)
			{
				this.player.jumpInertieMaxPosY = jumpInertieMaxPosY;
			}
			else
			{
				this.player.jumpInertieMaxPosY = this.player.jumpMaxPosY;
			}
		}
		// player is at the highest (fall begins)
		if (this.player.posY <= this.player.jumpInertieMaxPosY)
		{
			this.player.jump = -1;
		}
		// player is at the lowest (jump is over)
		if (this.player.posY > this.player.floorPosY)
		{
			this.player.jump = 0;
			this.player.posY = this.player.floorPosY;
			this.player.jumpInertieMaxPosY = this.player.jumpMaxPosY;
		}
		// player falling
		if (this.player.jump === -1)
		{
			this.player.posY += this.player.jumpStep;
		}
		// player jump
		if (this.player.jump === 1)
		{
			this.player.posY -= this.player.jumpStep;
		}
	}

	drawPlayer()
	{
		this.playerJump();
		// animation
		this.player.imgEveryFrame += 1;
		if (this.player.jump === 0)
		{
			if (this.player.imgEveryFrame % 5 === 0)
			{
				if (this.player.currentImgIndex < this.player.img.length - 1)
				{
					this.player.currentImgIndex += 1;
				}
				else
				{
					this.player.currentImgIndex = 0;
				}
			}
			this.canvasList[0].drawImage(this.player.img[this.player.currentImgIndex], this.player.posX, this.player.posY, this.player.width, this.player.height);
		}
		else
		{
			this.canvasList[0].drawImage(this.player.jumpImg, this.player.posX, this.player.posY, this.player.width, this.player.height);
		}
	}

	win()
	{
		this.endOfGame = true;
		let points = 100 - parseInt(document.getElementById("dglCOValue").innerText, 10);
		let winContainer = createElem("p", "class", "dglGameover");
		winContainer.innerHTML = "Félicitations, tu as terminé la partie avec "+points+" points!";
		document.getElementsByTagName("body")[0].appendChild(winContainer);
	}

	gameOver()
	{
		this.endOfGame = true;
		let gameOver = createElem("p", "class", "dglGameover");
		gameOver.innerHTML = "La partie est perdue...<br>Tu feras mieux une prochaine fois!";
		document.getElementsByTagName("body")[0].appendChild(gameOver);
	}

	refreshGame()
	{
		if (this.endOfGame == false)//endOfGame status change in treatAnswer()
		{
			// refresh canvas
			for (let i = this.canvasList.length - 1; i >= 0; i --)
			{
				this.canvasList[i].clearRect(0, 0, this.canvasList[i].canvas.width, this.canvasList[i].canvas.height);
			}

			// game cycle
			this.timeStart = this.countTime(this.frameBySecTimeStart, 1000);
			this.calculFrameBySec();
			this.createObstacle();
			this.createItem();
			this.drawParallax();
			this.drawGoal();
			this.drawInteractiveElements(this.currentObstacles, "obstacle");
			this.drawInteractiveElements(this.currentItems, "item");
			this.drawPlayer();
			this.deleteUiText();
			this.refreshGameLoop = window.requestAnimationFrame(this.refreshGame.bind(this));
		}
		else
		{
			// end of game
		}
	}

	detectKeyDown(that, event)
	{
		// "space"
		if (event.keyCode === 32 || event.type == "mousedown" || event.type == "touchstart")
		{
			event.preventDefault();
			if (this.player.jump === 0)
			{
				this.player.jump = 1;
			}
		}
	}

	detectKeyUp(that, event)
	{
		// "space"
		if (event.keyCode === 32 || event.type == "mouseup" || event.type == "touchend")
		{
			event.preventDefault();
			if (this.player.jump === 1)
			{
				this.player.jump = 2;
			}
		}
	}

	updateCanvasSizes()
	{
		for (let i = this.canvasList.length - 1; i >= 0; i--)
		{
			this.canvasList[i].canvas.width = window.innerWidth;
			this.canvasList[i].canvas.height = window.innerHeight;
		}
	}

	updateParallaxToCanvas(elem)
	{
		for (let i = elem.length - 1; i >= 0; i--)
		{
			let plx = elem[i];
			// update ratio
			let ratio = plx.width / plx.height;
			plx.height = (this.canvasList[0].canvas.height / 100) * plx.heightRatio;
			plx.width = plx.height * ratio;
			// update posY
			if (plx.posY != 0)
			{
				plx.posY = this.canvasList[0].canvas.height - plx.height;
			}
		}
	}

	updatePlayerToCanvas()
	{
		let ratio = this.player.width / this.player.height;
		this.player.height = (this.canvasList[0].canvas.height / 100) * 10;
		this.player.width = this.player.height * ratio;
		this.player.posX = (this.canvasList[0].canvas.width / 100) * 1;
		this.player.floorPosY = this.canvasList[0].canvas.height - this.player.height - (this.canvasList[0].canvas.height / 100) * 5;
		this.player.posY = this.player.floorPosY;
		this.player.jumpStep = this.player.height / 100 * 10;
		this.player.jumpMaxPosY = this.player.floorPosY - (this.player.height * 2.5);
		this.player.jumpInertieMaxPosY = this.player.jumpMaxPosY;
	}

	initCanvas(canvas, canvasName)
	{
		if (typeof canvasName == "string")
		{
			canvasName = canvas.getContext("2d");
			this.canvasList.push(canvasName);
		}
		else
		{
			for (let i = canvas.length - 1; i >= 0; i--)
			{
				this.updateCanvasSizes(canvas);
				canvasName[i] = canvas[i].getContext("2d");
			}
		}
		this.updateCanvasSizes();
	}

	initEvents()
	{
		let that = this;
		// resize
		window.addEventListener("resize", function()
		{
			that.updateCanvasSizes();
			that.updateParallaxToCanvas(that.parallax);
			that.updateParallaxToCanvas([that.plxGoal]);
			that.updatePlayerToCanvas();
			for (let i = that.currentObstacles.length - 1; i >= 0; i--)
			{
				that.updateInteractiveElements(that.currentObstacles[i]);
			}
			for (let i = that.currentItems.length - 1; i >= 0; i--)
			{
				that.updateInteractiveElements(that.currentItems[i]);
			}
		}, false);
		// commands
		document.addEventListener("keydown", this.detectKeyDown.bind(that, this), false);
		document.addEventListener("keyup", this.detectKeyUp.bind(that, this), false);

		document.addEventListener("mousedown", this.detectKeyDown.bind(that, this), false);
		document.addEventListener("mouseup", this.detectKeyUp.bind(that, this), false);
	}

	loadUI()
	{
		let dglContainer = document.getElementById("dglContainer");

		let uiContainer = createElem("div", ["id", "class"], ["dglUIContainer", "dglUIContainer"]);
		// CO2 metter
		let coMetterContainer = createElem("id", ["class"], ["dglCOMetterContainer"]);
		let coMetter = createElem("div", ["id","class"], ["dglCOMetter", "dglCOMetter"]);
		let coValue = createElem("p", ["id", "class"], ["dglCOValue", "dglCOValue"]);
		coValue.innerText = 50;
		coMetter.appendChild(coValue);
		coMetterContainer.appendChild(coMetter);
		uiContainer.appendChild(coMetterContainer);
		// Next item
		let nextItemContainer = createElem("div", ["id", "class"], ["dglNextItemContainer", "dglNextItemContainer"]);
		uiContainer.appendChild(nextItemContainer);

		dglContainer.appendChild(uiContainer);
	}

	launchGame()
	{
		// Create html content
		let dglContainer = document.getElementById("dglContainer");

		let dglCanvasContainer = createElem("div", ["id", "class"], ["dglCanvasContainer", "dglCanvasContainer"]);
		let dglCanvasMain = createElem("canvas", ["id", "class"], ["dglCanvasMain", "dglCanvasMain"]);

		dglCanvasContainer.appendChild(dglCanvasMain);
		dglContainer.appendChild(dglCanvasContainer);

		this.initCanvas(dglCanvasMain, "dglCtxMain");
		this.updateParallaxToCanvas(this.parallax);
		this.updateParallaxToCanvas([this.plxGoal]);
		this.updatePlayerToCanvas();
		this.initEvents();
		this.loadNextItem();
		this.refreshGame(); 
	}

	launchTuto()
	{
		let dglContainer = document.getElementById("dglContainer");
		let that = this;

		const req = new XMLHttpRequest();
		req.onreadystatechange = function(event)
		{
		    if (this.readyState === XMLHttpRequest.DONE)
		    {
		        if (this.status === 200)
		        {
					dglContainer.innerHTML = req.responseText;

					document.getElementById("dglLaunchGameButton").onclick = function()
					{
						document.getElementById("dglTutoContainer").remove();
						that.loadUI();
						that.launchGame();
					}
				}
		    }
		};
		req.open('GET', 'view/st_game_dgltuto.html', true);
		req.send(null);
	}

	closeGame()
	{
		window.cancelAnimationFrame(this.refreshGameLoop);
		let dglContainerChilds = document.querySelectorAll("#dglContainer div");
		for (let i = dglContainerChilds.length - 1; i >= 0; i--)
		{
	        //maximizeIntroductionQuestions();
			dglContainerChilds[i].remove();
			delete window.DinoGameLike;
		}
	}
};

let dgl = new DinoGameLike;
dgl.launchTuto(this);