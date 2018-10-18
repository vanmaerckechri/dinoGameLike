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
			posX: 0,
			posY: 0,
			floorPosY: 0,
			jump: 0,
			jumpStep: 0,
			jumpMaxPosY: 0,
			radius: 20
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
		this.canvasList[0].beginPath();
		this.canvasList[0].arc(this.player.posX, this.player.posY, this.player.radius, 0, 2*Math.PI);
		this.canvasList[0].fill();
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
		this.player.radius = (this.canvasList[0].canvas.height / 100) * 2;
		this.player.posX = (this.canvasList[0].canvas.width / 100) * 10;
		this.player.floorPosY = this.canvasList[0].canvas.height - this.player.radius - ((this.canvasList[0].canvas.height / 100) * 10);
		this.player.posY = this.canvasList[0].canvas.height - this.player.radius - ((this.canvasList[0].canvas.height / 100) * 10);
		this.player.jumpStep = (this.canvasList[0].canvas.height / 100) * 1;
		this.player.jumpMaxPosY = this.canvasList[0].canvas.height - (this.canvasList[0].canvas.height / 100) * 30;
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