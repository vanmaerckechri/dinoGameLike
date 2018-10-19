// -- GAME OBJECT --
let DinoGameLike = class
{
	constructor()
	{
		this.refreshGameLoop;
		this.canvasList = [];
		this.timeStart;
		this.speed = 1;
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
		this.plxMountains = 
		{
			img: createElem("img", "src", "assets/img/mountains.svg"),
			posX: 0,
			posY: 1,
			speedZ: 1,
			width: 1280,
			height: 640,
			heightRatio: 75
		};
		this.plxClouds = 
		{
			img: createElem("img", "src", "assets/img/clouds.svg"),
			posX: 0,
			posY: 0,
			speedZ: 0.5,
			width: 1280,
			height: 640,
			heightRatio: 75
		};
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
			jumpMaxPosY: 0,
			width: 1280,
			height: 720
		}
		this.parallax = [this.plxForest, this.plxMountains, this.plxClouds];
/*
		this.consumerProducts = 
		[
			this.packagedStrawberries = 
			{
				id: 0,
				img: createElem("img", "src", "assets/img/packStrawb.svg"),
				alt: "fraises emballées",
				co2: 1;
			},
			this.bulkStrawberries = 
			{
				id: 0,
				img: createElem("img", "src", "assets/img/bulkStrawb.svg"),
				alt: "fraises en vrac",
				co2: -1;
			}
		];
*/

		this.score = 0;
		this.endOfGame = false;

		this.frameBySec = 60;
		this.frameBySecTimeStart;
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
		// player is at the highest (fall begins)
		if (this.player.posY <= this.player.jumpMaxPosY)
		{
			this.player.jump = -1;
		}
		// player is at the lowest (jump is over)
		if (this.player.posY > this.player.floorPosY)
		{
			this.player.jump = 0;
			this.player.posY = this.player.floorPosY;
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
			this.drawParallax();
			this.drawPlayer();
			this.refreshGameLoop = window.requestAnimationFrame(this.refreshGame.bind(this));
		}
		else
		{
			// end of game
		}
	}

	detectKey(that, event)
	{
		// "space"
		if (event.keyCode === 32)
		{
			if (this.player.jump === 0)
			{
				this.player.jump = 1;
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

	updateParallaxToCanvas()
	{
		for (let i = this.parallax.length - 1; i >= 0; i--)
		{
			let plx = this.parallax[i];
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
		this.player.jumpStep = (this.canvasList[0].canvas.height / 100) * 1;
		this.player.jumpMaxPosY = this.player.floorPosY - (this.canvasList[0].canvas.height / 100) * 20;
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
			that.updateParallaxToCanvas();
			that.updatePlayerToCanvas();
		}, false);
		// commands
		document.addEventListener("keydown", this.detectKey.bind(that, this), false);
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
		this.updateParallaxToCanvas();
		this.updatePlayerToCanvas();
		this.initEvents();
		window.requestAnimationFrame(this.refreshGame.bind(this)); 
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
						document.getElementById("dglTutoContainer").classList.add("disabled");
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