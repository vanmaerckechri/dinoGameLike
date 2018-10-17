// -- GAME OBJECT --
let DinoGameLike = class
{
	constructor()
	{
		this.refreshGameLoop;
		this.canvasList = [];
		this.timeStart;

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
	}

	countTime(milliSec)
	{
		let currentTime = new Date().getTime();
		if ((currentTime - this.timeStart) >= milliSec || typeof this.timeStart == "undefined")
		{
			this.timeStart = new Date().getTime();
		}
	}

	refreshGame()
	{
		if (this.endOfGame == false)//endOfGame status change in treatAnswer()
		{
			// refresh canvas
			for (let i = this.canvasList.length - 1; i >= 0; i --)
			{
				this.canvasList[i].clearRect(0, 0, this.canvasList[i].width, this.canvasList[i].height);
			}

			// game cycle
			this.countTime(150);
			this.refreshGameLoop = window.requestAnimationFrame(this.refreshGame.bind(this));
		}
		else
		{
			// end of game
		}
	}

	initCommands()
	{
	}

	initCanvas(canvas, canvasName)
	{
		if (typeof canvasName == "string")
		{
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			canvasName = canvas.getContext("2d");
			this.canvasList.push(canvasName);
		}
		else
		{
			for (let i = canvas.length - 1; i >= 0; i--)
			{
				canvas[i].width = window.innerWidth;
				canvas[i].height = window.innerHeight;
				canvasName[i] = canvas[i].getContext("2d");
				this.canvasList.push(canvasName[i]);
			}
		}
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
		this.initCommands();
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